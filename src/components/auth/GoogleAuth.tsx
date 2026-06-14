import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export function GoogleAuth({ callbackUrl = "/dashboard" }: { callbackUrl?: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => signIn("google", { callbackUrl })}
    >
      الدخول باستخدام Google
    </Button>
  );
}