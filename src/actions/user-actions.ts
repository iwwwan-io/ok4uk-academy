"use server";

import { Tables } from "@/types/database";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function editUser(
  id: string,
  data: Partial<Tables<"profiles">>
): Promise<string | null> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("profiles").update(data).eq("id", id);

    if (error) {
      console.error("Error updating user:", error);
      return `error:${error.message}`;
    }

    revalidatePath("/admin/users");
    return "success";
  } catch (error) {
    console.error("Registration error:", error);
    return "error:Terjadi kesalahan saat registrasi.";
  }
}

/**
 * Delete user dari auth.users
 * Karena ada FK ON DELETE CASCADE, profile ikut kehapus otomatis
 */
export async function deleteUser(id: string): Promise<string | null> {
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // HARUS pakai service_role
  );

  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      console.error("Error deleting user:", error);
      return `error:${error.message}`;
    }

    revalidatePath("/admin/users");
    return "success";
  } catch (error) {
    console.error("Delete user error:", error);
    return "error:Terjadi kesalahan saat menghapus user.";
  }
}
