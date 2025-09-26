// src/app/[role]/account/page.tsx
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { resendVerificationEmail } from "@/actions/auth-actions";
import { toast } from "sonner";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Tangani jika pengguna tidak ada, misalnya redirect ke halaman login
    return <div className="text-center py-20">Pengguna tidak ditemukan.</div>;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("name, role, email_verified, avatar_url")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    console.error("Gagal mengambil profil:", error?.message);
    return <div className="text-center py-20">Gagal memuat profil.</div>;
  }

  // Fallback untuk avatar
  const getInitials = (name: string | null) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "UG";
  };

  const handleResendVerificationEmail = async () => {
    try {
      await resendVerificationEmail();
      toast.success("Email verifikasi telah dikirim ulang.");
    } catch (error) {
      console.log(error);
      toast.error("Gagal mengirim verifikasi email");
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="flex flex-col items-center justify-center gap-4 text-center mb-8">
        <Avatar className="h-24 w-24 md:h-28 md:w-28 border-2 border-primary rounded-full">
          <AvatarImage
            src={profile.avatar_url ?? ""}
            alt={profile.name ?? "User"}
          />
          <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold">{profile.name}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>
      <Separator className="mb-8" />
      <Tabs defaultValue="public-profile" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
          <TabsTrigger value="public-profile">Profil Publik</TabsTrigger>
          <TabsTrigger value="account-settings">Pengaturan Akun</TabsTrigger>
        </TabsList>
        <TabsContent value="public-profile">
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Informasi Profil Publik</CardTitle>
                <Link href="/profile/edit">
                  <Button size="sm">Edit Profile</Button>
                </Link>
              </div>
              <CardDescription>
                Informasi ini akan ditampilkan kepada pengguna lain.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input id="name" defaultValue={profile.name ?? ""} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Peran</Label>
                <Badge>{profile.role ?? "Pengguna"}</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="account-settings">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Pengaturan Akun</CardTitle>
              <CardDescription>Informasi akun pribadi Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user.email ?? ""} readOnly />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Status Verifikasi
                </p>
                <Badge
                  variant={profile.email_verified ? "secondary" : "destructive"}
                >
                  {profile.email_verified
                    ? "✅ Terverifikasi"
                    : "❌ Belum Terverifikasi"}
                </Badge>
                {!profile.email_verified && (
                  <Button size="sm" onClick={handleResendVerificationEmail}>
                    Resend Verification Email
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
