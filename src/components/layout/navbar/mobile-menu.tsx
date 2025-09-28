"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavigationLink } from "./navigation-links";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  links: NavigationLink[];
};

export function MobileMenu({ open, setOpen, links }: Props) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="top" className="mt-16 z-40 w-full">
        <SheetHeader className="h-0 hidden">
          <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
        </SheetHeader>
        <nav className="mx-6 mb-6 space-y-4">
          {links.map((link) =>
            link.dropdown ? (
              <div key={link.label}>
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {link.label}
                </p>
                <ul className="mt-2 space-y-2 pl-2">
                  {link.dropdown.map(({ href, label }) => (
                    <li key={href}>
                      <SheetClose asChild>
                        <Link
                          href={href}
                          className={cn(
                            "block text-base hover:text-primary",
                            pathname === href && "font-medium text-primary"
                          )}
                        >
                          {label}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              link.href && (
                <SheetClose key={link.href} asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      "block text-base hover:text-primary",
                      pathname === link.href && "font-medium text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              )
            )
          )}
          <Button asChild variant="outline" className="w-full mt-4">
            <Link href="/auth/login">Login</Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
