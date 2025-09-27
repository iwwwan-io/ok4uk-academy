"use client";

import { logout } from "@/actions/auth-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Tables } from "@/types/database";
import { Bell, CreditCardIcon, LogOutIcon, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function NavUser({ user }: { user: Tables<"profiles"> | null }) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Berhasil logout");
      router.push("/login"); // redirect di client
    } catch (err) {
      console.error("Sign out error:", err);
      toast.error("Gagal logout. Silakan coba lagi.");
    }
  };

  const handleAccountPage = () => {
    router.push(`/${user?.role}/account`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 rounded-full border">
          <AvatarImage
            src={user?.avatar_url || "/images/team/anonimous.jpg"}
            alt={"Avatar"}
          />
          <AvatarFallback>
            {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-56 rounded-lg"
        side={"bottom"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={user?.avatar_url || "/images/team/anonimous.jpg"}
                alt={"avatar"}
              />
              <AvatarFallback className="rounded-lg">
                {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {user?.name || "Anonymous"}
              </span>
              <span className="text-muted-foreground truncate text-xs">
                {user?.email || "No email provided"}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleAccountPage}>
            <User className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/billing`}>
              <CreditCardIcon className="mr-2 h-4 w-4" />
              Billing
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/notification`}>
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOutIcon className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
