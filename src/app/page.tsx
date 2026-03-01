import { redirect } from "next/navigation";
import { getRequiredSession, getUserOrganizations } from "@/lib/auth-guards";

export default async function IndexPage() {
  const { dbUser } = await getRequiredSession();
  const organizations = await getUserOrganizations(dbUser.id);

  if (dbUser.appRole === "admin") {
    redirect("/admin");
  }

  if (organizations.length === 0) {
    redirect("/onboarding/organization");
  }

  redirect("/home");
}
