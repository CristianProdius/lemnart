"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UserButton() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      {session?.user && (
        <span className="text-sm text-muted-foreground hidden md:inline">
          {session.user.name || session.user.email}
        </span>
      )}
      <Button variant="ghost" size="icon" onClick={handleSignOut}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
