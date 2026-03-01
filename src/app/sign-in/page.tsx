"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { AppIcon } from "@/lib/icons";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);

    try {
      if (isSignUp) {
        const result = await authClient.signUp.email({
          email,
          password,
          name: name || email,
          callbackURL: "/",
        });
        if (result.error) {
          toast.error(result.error.message ?? "Could not create account");
        } else {
          toast.success("Account created successfully");
          router.push("/");
          router.refresh();
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/",
        });
        if (result.error) {
          toast.error(result.error.message ?? "Could not sign in");
        } else {
          toast.success("Signed in successfully");
          router.push("/");
          router.refresh();
        }
      }
    } catch {
      toast.error("Unexpected error while authenticating");
    } finally {
      setPending(false);
    }
  };

  const onGitHub = async () => {
    setPending(true);
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch {
      toast.error("GitHub sign-in is not configured yet");
      setPending(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AppIcon className="size-5 text-muted-foreground" />
            {isSignUp ? "Create account" : "Sign in"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-3" onSubmit={onSubmit}>
            {isSignUp ? (
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Name (optional)"
              />
            ) : null}
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              required
            />
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
            </Button>
          </form>

          <Button variant="outline" className="w-full" onClick={onGitHub}>
            Continue with GitHub
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setIsSignUp((value) => !value)}
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Need an account? Sign up"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
