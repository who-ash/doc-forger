"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const onSignOut = async () => {
    setPending(true);
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
    setPending(false);
  };

  return (
    <Button variant="outline" onClick={onSignOut} disabled={pending}>
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
