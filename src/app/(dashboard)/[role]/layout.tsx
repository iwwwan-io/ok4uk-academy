import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { BellIcon, ChevronDownIcon } from "lucide-react";
import { NavUser } from "@/components/nav-user";
import { Footer } from "@/components/layout/footer";

import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/types/database.types";
import { notFound, redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
};

export default async function RoleLayout({ children, params }: Props) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }
  const { role } = await params;

  const allowedRole = ["admin", "student", "assessor"];

  // validasi role
  if (!allowedRole.includes(role)) {
    notFound();
  }

  let profile: Tables<"profiles"> | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  // Check if user role matches the route role
  if (profile && profile.role !== role) {
    notFound();
  }

  return (
    <>
      <nav className="shadow">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Left: Logo & Role Info */}
            <div className="flex items-center gap-6 w-full">
              <Link
                href={`/${profile?.role}`}
                className="flex items-center gap-2"
              >
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
                  className="h-8 w-auto dark:block hidden"
                  width={100}
                  height={50}
                />
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex items-center gap-2 h-12">
                    <span className="text-sm md:text-lg font-medium">
                      {(profile?.name?.length ?? 0) > 15
                        ? `${profile?.name
                            ?.toLocaleUpperCase()
                            .slice(0, 15)}...`
                        : profile?.name?.toLocaleUpperCase() || "GUEST"}
                    </span>
                    <Badge variant="secondary" className="capitalize text-sm">
                      {profile?.role || "Guest"}
                    </Badge>
                    <ChevronDownIcon className="h-4 w-4" />
                  </div>
                </DropdownMenuTrigger>

                {profile?.role === "admin" && (
                  <DropdownMenuContent
                    side="bottom"
                    sideOffset={4}
                    className="w-56"
                  >
                    <Link href={`/dashboard/admin`} passHref>
                      <DropdownMenuItem className="cursor-pointer">
                        Dashboard Admin
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/dashboard/student`} passHref>
                      <DropdownMenuItem className="cursor-pointer">
                        Dashboard Student
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/dashboard/assessor`} passHref>
                      <DropdownMenuItem className="cursor-pointer">
                        Dashboard Assessor
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
            </div>

            {/* Right: Notification & User Avatar */}
            <div className="flex items-center gap-4">
              <AnimatedThemeToggler />
              <BellIcon className="h-5 w-5 text-slate-400" />
              <NavUser user={profile} />
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
