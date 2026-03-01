import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignOutButton } from "@/components/sign-out-button";
import { getRequiredSession, getUserOrganizations } from "@/lib/auth-guards";
import { UserIcon } from "@/lib/icons";

export default async function HomePage() {
  const { dbUser } = await getRequiredSession();

  if (dbUser.appRole === "admin") {
    redirect("/admin");
  }

  const organizations = await getUserOrganizations(dbUser.id);
  if (organizations.length === 0) {
    redirect("/onboarding/organization");
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold">
            <UserIcon className="size-5 text-muted-foreground" />
            Home
          </h1>
          <p className="text-muted-foreground text-sm">
            Onboarding complete. Project setup comes in the next stage.
          </p>
        </div>
        <SignOutButton />
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>
            Add Project is intentionally disabled in this first stage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button disabled>Add Project (coming soon)</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your organizations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {organizations.map((organization) => (
            <div
              key={organization.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div>
                <p className="font-medium">{organization.name}</p>
                <p className="text-muted-foreground text-sm">
                  Role: {organization.role}
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href={`/organization/${organization.slug}`}>Manage members</Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
