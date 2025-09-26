"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DesktopMenu } from "./desktop-menu";
import { MobileMenu } from "./mobile-menu";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { getNavigationLinks, NavigationLink } from "./navigation-links";
import { supabase } from "@/lib/supabase/client";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState<NavigationLink[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loadLinks = async () => {
      const navLinks = await getNavigationLinks();
      setLinks(navLinks);
    };

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };

    loadLinks();
    checkSession();

    // listen supaya realtime kalau login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background border-b">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex gap-10 lg:gap-20">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo/ok4uk-light-text.svg"
              alt="OK4UK"
              className="h-8 w-auto dark:hidden"
              width={100}
              height={50}
            />
            <Image
              src="/logo/ok4uk-dark-text.svg"
              alt="OK4UK"
              className="h-8 w-auto hidden dark:block"
              width={100}
              height={50}
            />
          </Link>
          <DesktopMenu links={links} />
        </div>

        <div className="flex items-center gap-4 relative">
          <AnimatedThemeToggler />

          {isLoggedIn ? (
            <Button
              asChild
              size="sm"
              variant="default"
              className="hidden md:inline-flex rounded-full"
            >
              <Link href="/student">Dashboard</Link>
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
              variant="link"
              className="hidden md:inline-flex rounded-full"
            >
              <Link href="/auth/login">Login</Link>
            </Button>
          )}

          <Button
            variant="ghost"
            className="md:hidden h-10 w-10"
            onClick={() => setOpen(!open)}
          >
            <div className="grid justify-items-center gap-1.5">
              <span
                className={`h-0.5 w-6 rounded-full bg-muted-foreground transition ${
                  open ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`h-0.5 w-6 rounded-full bg-muted-foreground transition ${
                  open ? "scale-x-0" : ""
                }`}
              />
              <span
                className={`h-0.5 w-6 rounded-full bg-muted-foreground transition ${
                  open ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </Button>

          <MobileMenu open={open} setOpen={setOpen} links={links} />
        </div>
      </nav>
    </header>
  );
}
