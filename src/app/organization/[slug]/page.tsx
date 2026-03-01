import Link from "next/link";
import { and, eq } from "drizzle-orm";
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
import {
  getRequiredSession,
  requireOrganizationMember,
} from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { organizationMembers, organizations, user } from "@/lib/db/schema";

const addMemberSchema = z.object({
  email: z.email(),
  role: z.enum(["admin", "member"]),
});

function canManageMembers(role: string) {
  return role === "owner" || role === "admin";
}

export default async function OrganizationMembersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { dbUser } = await getRequiredSession();
  const { slug } = await params;
  const membership = await requireOrganizationMember(dbUser.id, slug);

  async function addMemberAction(formData: FormData) {
    "use server";

    const { dbUser: currentUser } = await getRequiredSession();
    const currentMembership = await requireOrganizationMember(currentUser.id, slug);
    if (!canManageMembers(currentMembership.role)) {
      redirect(`/organization/${slug}?error=unauthorized`);
    }

    const parsed = addMemberSchema.safeParse({
      email: String(formData.get("email") ?? ""),
      role: String(formData.get("role") ?? "member"),
    });

    if (!parsed.success) {
      redirect(`/organization/${slug}?error=invalid-member`);
    }

    const [targetUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, parsed.data.email))
      .limit(1);

    if (!targetUser) {
      redirect(`/organization/${slug}?error=user-not-found`);
    }

    await db
      .insert(organizationMembers)
      .values({
        organizationId: currentMembership.organizationId,
        userId: targetUser.id,
        role: parsed.data.role,
        createdAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [organizationMembers.organizationId, organizationMembers.userId],
        set: { role: parsed.data.role },
      });

    revalidatePath(`/organization/${slug}`);
  }

  async function updateMemberRoleAction(formData: FormData) {
    "use server";

    const { dbUser: currentUser } = await getRequiredSession();
    const currentMembership = await requireOrganizationMember(currentUser.id, slug);
    if (!canManageMembers(currentMembership.role)) {
      redirect(`/organization/${slug}?error=unauthorized`);
    }

    const userId = String(formData.get("userId") ?? "");
    const role = String(formData.get("role") ?? "member");
    if (!userId || !["owner", "admin", "member"].includes(role)) {
      redirect(`/organization/${slug}?error=invalid-role`);
    }

    await db
      .update(organizationMembers)
      .set({ role: role as "owner" | "admin" | "member" })
      .where(
        and(
          eq(organizationMembers.organizationId, currentMembership.organizationId),
          eq(organizationMembers.userId, userId),
        ),
      );

    revalidatePath(`/organization/${slug}`);
  }

  async function removeMemberAction(formData: FormData) {
    "use server";

    const { dbUser: currentUser } = await getRequiredSession();
    const currentMembership = await requireOrganizationMember(currentUser.id, slug);
    if (!canManageMembers(currentMembership.role)) {
      redirect(`/organization/${slug}?error=unauthorized`);
    }

    const userId = String(formData.get("userId") ?? "");
    if (!userId || userId === currentUser.id) {
      redirect(`/organization/${slug}?error=invalid-remove`);
    }

    await db
      .delete(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, currentMembership.organizationId),
          eq(organizationMembers.userId, userId),
        ),
      );

    revalidatePath(`/organization/${slug}`);
  }

  const [organization] = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      slug: organizations.slug,
    })
    .from(organizations)
    .where(eq(organizations.id, membership.organizationId))
    .limit(1);

  const members = await db
    .select({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: organizationMembers.role,
    })
    .from(organizationMembers)
    .innerJoin(user, eq(user.id, organizationMembers.userId))
    .where(eq(organizationMembers.organizationId, membership.organizationId));

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{organization?.name}</h1>
          <p className="text-muted-foreground text-sm">
            Manage members for /{organization?.slug}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/home">Back to home</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>Your current role: {membership.role}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {canManageMembers(membership.role) ? (
            <form action={addMemberAction} className="grid gap-2 md:grid-cols-3">
              <Input name="email" placeholder="User email" required />
              <select
                name="role"
                className="h-9 rounded-md border bg-background px-3 text-sm"
                defaultValue="member"
              >
                <option value="member">member</option>
                <option value="admin">admin</option>
              </select>
              <Button type="submit">Add member</Button>
            </form>
          ) : null}

          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.userId} className="rounded-md border p-3">
                <div className="mb-2">
                  <p className="font-medium">{member.name || "Unnamed user"}</p>
                  <p className="text-muted-foreground text-sm">{member.email}</p>
                </div>
                {canManageMembers(membership.role) ? (
                  <div className="flex flex-wrap gap-2">
                    <form action={updateMemberRoleAction} className="flex gap-2">
                      <input type="hidden" name="userId" value={member.userId} />
                      <select
                        name="role"
                        defaultValue={member.role}
                        className="h-9 rounded-md border bg-background px-3 text-sm"
                      >
                        <option value="owner">owner</option>
                        <option value="admin">admin</option>
                        <option value="member">member</option>
                      </select>
                      <Button type="submit" variant="outline">
                        Edit
                      </Button>
                    </form>
                    <form action={removeMemberAction}>
                      <input type="hidden" name="userId" value={member.userId} />
                      <Button type="submit" variant="destructive">
                        Delete
                      </Button>
                    </form>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Role: {member.role}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
