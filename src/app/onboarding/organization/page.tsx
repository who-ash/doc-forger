import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getRequiredSession, getUserOrganizations } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { organizationMembers, organizations } from "@/lib/db/schema";
import { slugify } from "@/lib/slugs";

const createOrganizationSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
});

export default async function OrganizationOnboardingPage() {
  const { dbUser } = await getRequiredSession();
  const existingOrganizations = await getUserOrganizations(dbUser.id);

  if (existingOrganizations.length > 0) {
    redirect("/home");
  }

  async function createOrganization(formData: FormData) {
    "use server";

    const { dbUser: currentUser } = await getRequiredSession();

    const name = String(formData.get("name") ?? "");
    const rawSlug = String(formData.get("slug") ?? "");
    const parsed = createOrganizationSchema.safeParse({
      name,
      slug: slugify(rawSlug || name),
    });

    if (!parsed.success) {
      redirect("/onboarding/organization?error=invalid-input");
    }

    const existing = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.slug, parsed.data.slug))
      .limit(1);

    if (existing.length > 0) {
      redirect("/onboarding/organization?error=slug-taken");
    }

    const organizationId = crypto.randomUUID();
    await db.insert(organizations).values({
      id: organizationId,
      name: parsed.data.name,
      slug: parsed.data.slug,
      createdByUserId: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.insert(organizationMembers).values({
      organizationId,
      userId: currentUser.id,
      role: "owner",
      createdAt: new Date(),
    });

    revalidatePath("/");
    redirect("/home");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create your organization</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createOrganization} className="space-y-4">
            <Input name="name" placeholder="Organization name" required />
            <Input name="slug" placeholder="organization-slug" required />
            <Button type="submit">Create organization</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
