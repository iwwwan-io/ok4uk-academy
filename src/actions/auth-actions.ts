"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Tables } from "@/types/database";

// Authentication actions
export async function registerUser(formData: FormData): Promise<string | null> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as Tables<"profiles">["role"];
  const supabase = await createClient();

  if (!email || !password || !name || !role) {
    return "error:Semua field wajib diisi.";
  }

  try {
    // 1. Register user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Auth error:", authError);
      return `error:${authError.message}`;
    }

    const user = authData?.user;
    if (!user || !user.id) {
      return "error:Registrasi gagal. User tidak ditemukan.";
    }

    // 2. Insert profile data
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email,
        name,
        role,
      })
      .select()
      .single();

    if (profileError || !profileData) {
      console.error("Profile insert error:", profileError);
      // Optional: clean up auth user if profile insert fails
      await supabase.auth.admin.deleteUser(user.id);
      return "error:Registrasi gagal. Profil gagal disimpan. Silakan coba lagi.";
    }

    // 3. Finalize
    revalidatePath("/");
    return "/login?message=Registrasi berhasil. Silakan cek email untuk verifikasi.";
  } catch (error) {
    console.error("Registration error:", error);
    return "error:Terjadi kesalahan saat registrasi.";
  }
}

export async function login(
  prevState: string | null,
  formData: FormData | null
): Promise<string | null> {
  const supabase = await createClient();
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData?.get("email") as string,
    password: formData?.get("password") as string,
  };
  const { data: signInData, error } = await supabase.auth.signInWithPassword(
    data
  );
  if (error) {
    console.log(error);
    return `error:${error.message}`;
  }

  const user = signInData.user;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile) {
      revalidatePath("/", "layout");
      return `/${profile.role}`;
    }
  }

  // Fallback if profile not found
  revalidatePath("/", "layout");
  return "/";
}

/**
 * Logout user & clear Supabase session (server-side)
 */
export async function logout() {
  const supabase = await createClient();
  const cookieStore = await cookies();

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Supabase signOut error:", error.message);
    throw new Error("Gagal logout dari Supabase");
  }

  // Bersihkan cookie
  cookieStore.set("sb:token", "", { maxAge: -1, path: "/" });
  cookieStore.set("sb-refresh-token", "", { maxAge: -1, path: "/" });

  return { success: true };
}

export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const supabase = await createClient();
  if (!email) {
    throw new Error("Email is required");
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/");
    redirect(
      "/login?message=Password reset email sent. Please check your inbox."
    );
  } catch (error) {
    throw error;
  }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;

  if (!password) {
    throw new Error("Password is required");
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/");
    redirect(
      "/login?message=Password updated successfully. Please log in with your new password."
    );
  } catch (error) {
    throw error;
  }
}

export const resendVerificationEmail = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Tidak ada user yang login.");
  }

  const { error } = await supabase.auth.resend({
    type: "email_change",
    email: user.email ?? "",
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
};
