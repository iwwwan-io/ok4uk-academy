"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AuthHeader() {
  const link = usePathname().includes("sign-up") ? "login" : "sign-up";
  return (
    <div className="flex flex-col items-center gap-2">
      <Link href="/" className="flex flex-col items-center gap-2 font-medium">
        <Image
          src="/logo/ok4uk-icon.png"
          alt="OK4UK Logo"
          width={100}
          height={100}
        />
      </Link>
      <h1 className="text-xl font-bold font-mono">Welcome to OK4UK Academy</h1>
      <div className="text-center text-sm">
        Don’t have an account?{" "}
        <Link
          href={link === "sign-up" ? "/auth/sign-up" : "/auth/login"}
          className="underline underline-offset-4"
        >
          {link === "sign-up" ? "Sign Up" : "Sign In"}
        </Link>
      </div>
    </div>
  );
}
