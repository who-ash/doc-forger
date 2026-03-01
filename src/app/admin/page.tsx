import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SignOutButton } from "@/components/sign-out-button";
import { getRequiredSession } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { organizations, user } from "@/lib/db/schema";
import { UserIcon } from "@/lib/icons";
import { slugify } from "@/lib/slugs";

const createUserSchema = z.object({
  email: z.email(),
  name: z.string().optional(),
  appRole: z.enum(["admin", "user"]),
});

const createOrganizationSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
});

async function requireAdmin() {
  const { dbUser } = await getRequiredSession();
  if (dbUser.appRole !== "admin") {
    redirect("/home");
  }
  return dbUser;
}

export default async function AdminPage() {
  await requireAdmin();

  async function createUserAction(formData: FormData) {
    "use server";
    await requireAdmin();

    const parsed = createUserSchema.safeParse({
      email: String(formData.get("email") ?? ""),
      name: String(formData.get("name") ?? ""),
      appRole: String(formData.get("appRole") ?? "user"),
    });

    if (!parsed.success) {
      redirect("/admin?error=invalid-user");
    }

    await db.insert(user).values({
      id: crypto.randomUUID(),
      email: parsed.data.email,
      name: parsed.data.name || null,
      emailVerified: false,
      image: null,
      appRole: parsed.data.appRole,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/admin");
  }

  async function updateUserRoleAction(formData: FormData) {
    "use server";
    await requireAdmin();

    const userId = String(formData.get("userId") ?? "");
    const appRole = String(formData.get("appRole") ?? "user");

    if (!userId || (appRole !== "admin" && appRole !== "user")) {
      redirect("/admin?error=invalid-role");
    }

    await db.update(user).set({ appRole, updatedAt: new Date() }).where(eq(user.id, userId));
    revalidatePath("/admin");
  }

  async function deleteUserAction(formData: FormData) {
    "use server";
    const currentUser = await requireAdmin();

    const userId = String(formData.get("userId") ?? "");
    if (!userId || userId === currentUser.id) {
      redirect("/admin?error=invalid-delete");
    }

    await db.delete(user).where(eq(user.id, userId));
    revalidatePath("/admin");
  }

  async function createOrganizationAction(formData: FormData) {
    "use server";
    const currentUser = await requireAdmin();

    const rawName = String(formData.get("name") ?? "");
    const rawSlug = String(formData.get("slug") ?? "");
    const parsed = createOrganizationSchema.safeParse({
      name: rawName,
      slug: slugify(rawSlug || rawName),
    });

    if (!parsed.success) {
      redirect("/admin?error=invalid-organization");
    }

    await db.insert(organizations).values({
      id: crypto.randomUUID(),
      name: parsed.data.name,
      slug: parsed.data.slug,
      createdByUserId: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/admin");
  }

  async function deleteOrganizationAction(formData: FormData) {
    "use server";
    await requireAdmin();

    const organizationId = String(formData.get("organizationId") ?? "");
    if (!organizationId) {
      redirect("/admin?error=invalid-organization-delete");
    }

    await db.delete(organizations).where(eq(organizations.id, organizationId));
    revalidatePath("/admin");
  }

  const [usersCountRow] = await db.select({ value: count() }).from(user);
  const [organizationsCountRow] = await db
    .select({ value: count() })
    .from(organizations);

  const users = await db
    .select({
      id: user.id,
      email: user.email,
      name: user.name,
      appRole: user.appRole,
      createdAt: user.createdAt,
    })
    .from(user);

  const orgs = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      slug: organizations.slug,
      createdAt: organizations.createdAt,
    })
    .from(organizations);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold">
            <UserIcon className="size-5 text-muted-foreground" />
            Admin
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage users and organizations.
          </p>
        </div>
        <SignOutButton />
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {organizationsCountRow?.value ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {usersCountRow?.value ?? 0}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Create, edit role, or delete users.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={createUserAction} className="grid gap-2 md:grid-cols-4">
              <Input name="name" placeholder="Name" />
              <Input name="email" type="email" placeholder="Email" required />
              <select
                name="appRole"
                className="h-9 rounded-md border bg-background px-3 text-sm"
                defaultValue="user"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
              <Button type="submit">Create</Button>
            </form>

            <div className="space-y-2">
              {users.map((item) => (
                <div key={item.id} className="rounded-md border p-3">
                  <div className="mb-2">
                    <p className="font-medium">{item.name || "Unnamed user"}</p>
                    <p className="text-muted-foreground text-sm">{item.email}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <form action={updateUserRoleAction} className="flex gap-2">
                      <input type="hidden" name="userId" value={item.id} />
                      <select
                        name="appRole"
                        defaultValue={item.appRole}
                        className="h-9 rounded-md border bg-background px-3 text-sm"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                      <Button type="submit" variant="outline">
                        Edit
                      </Button>
                    </form>
                    <form action={deleteUserAction}>
                      <input type="hidden" name="userId" value={item.id} />
                      <Button type="submit" variant="destructive">
                        Delete
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
            <CardDescription>Create or delete organizations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              action={createOrganizationAction}
              className="grid gap-2 md:grid-cols-3"
            >
              <Input name="name" placeholder="Organization name" required />
              <Input name="slug" placeholder="organization-slug" required />
              <Button type="submit">Create</Button>
            </form>

            <div className="space-y-2">
              {orgs.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground text-sm">/{item.slug}</p>
                  </div>
                  <form action={deleteOrganizationAction}>
                    <input type="hidden" name="organizationId" value={item.id} />
                    <Button type="submit" variant="destructive">
                      Delete
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
