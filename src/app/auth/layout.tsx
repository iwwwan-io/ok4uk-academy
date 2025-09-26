import AuthFooter from "@/components/auth/auth-footer";
import { AuthHeader } from "@/components/auth/auth-header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (user.data.user?.id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.data.user.id)
      .single();

    if (profile) {
      console.log(profile.role);
      redirect(`/${profile.role}`);
    }
  }
  return (
    <div className="flex flex-col min-h-svh w-full items-center justify-center gap-4 p-6 md:p-10">
      <AuthHeader />
      <div className="w-full max-w-sm">{children}</div>
      <AuthFooter />
    </div>
  );
}
