"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  href?: string;
  dropdown?: { href: string; label: string }[];
};

interface DesktopMenuProps {
  links: NavLink[];
}

export function DesktopMenu({ links }: DesktopMenuProps) {
  const pathname = usePathname();

  if (!links?.length) return null;

  return (
    <NavigationMenu className="hidden md:flex" viewport={false}>
      <NavigationMenuList className="gap-8">
        {links.map((link) =>
          link.dropdown ? (
            <NavigationMenuItem key={link.label}>
              <NavigationMenuTrigger
                className={cn(
                  "text-sm font-normal",
                  link.dropdown.some((d) => pathname.startsWith(d.href)) &&
                    "font-medium text-primary"
                )}
              >
                {link.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-4">
                <ul className="grid gap-2 w-56">
                  {link.dropdown.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className={cn(
                          "block rounded-md px-3 py-2 text-sm hover:bg-muted",
                          pathname === href && "font-medium text-primary"
                        )}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={link.href ?? link.label}>
              <NavigationMenuLink
                asChild
                className={cn(
                  "text-sm transition-colors hover:text-primary",
                  pathname === link.href && "font-medium text-primary"
                )}
              >
                {link.href ? (
                  <Link href={link.href}>{link.label}</Link>
                ) : (
                  <span>{link.label}</span>
                )}
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
