"use client";

import { Apple, Mail } from "lucide-react"; // Ganti Mail jika ingin icon Google
import { Button } from "@/components/ui/button";

export function OAuthButtons() {


  return (
    <div className="grid gap-y-4 w-full max-w-sm my-4">
      <Button variant="outline" type="button" className="w-full" disabled>
        <Apple className="mr-2 h-5 w-5" />
        Continue with Apple
      </Button>
      <Button
        variant="outline"
        type="button"
        className="w-full"
      >
        <Mail className="mr-2 h-5 w-5" />
        Continue with Google
      </Button>
    </div>
  );
}
