import { and, count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { organizationMembers, organizations, user } from "@/lib/db/schema";

async function ensureFirstAdmin(userId: string) {
  const [row] = await db
    .select({ value: count() })
    .from(user)
    .where(eq(user.appRole, "admin"));

  if ((row?.value ?? 0) > 0) {
    return;
  }

  await db
    .update(user)
    .set({
      appRole: "admin",
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId));
}

export async function getRequiredSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  await ensureFirstAdmin(session.user.id);

  const [dbUser] = await db
    .select({
      id: user.id,
      email: user.email,
      name: user.name,
      appRole: user.appRole,
    })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!dbUser) {
    redirect("/sign-in");
  }

  return { session, dbUser };
}

export async function getUserOrganizations(userId: string) {
  return db
    .select({
      id: organizations.id,
      name: organizations.name,
      slug: organizations.slug,
      role: organizationMembers.role,
    })
    .from(organizationMembers)
    .innerJoin(
      organizations,
      eq(organizations.id, organizationMembers.organizationId),
    )
    .where(eq(organizationMembers.userId, userId));
}

export async function requireOrganizationMember(userId: string, slug: string) {
  const [membership] = await db
    .select({
      organizationId: organizations.id,
      organizationName: organizations.name,
      organizationSlug: organizations.slug,
      role: organizationMembers.role,
    })
    .from(organizations)
    .innerJoin(
      organizationMembers,
      and(
        eq(organizationMembers.organizationId, organizations.id),
        eq(organizationMembers.userId, userId),
      ),
    )
    .where(eq(organizations.slug, slug))
    .limit(1);

  if (!membership) {
    redirect("/home");
  }

  return membership;
}
