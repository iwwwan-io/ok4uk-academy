// types/database.helpers.ts
import type { Database as DB } from "./database.types";

declare global {
  // Supaya bisa pakai langsung Database tanpa import
  // (bisa diaktifkan kalau memang suka global types)
  var Database: DB;
}

export type Database = DB;

// Helper untuk akses cepat
export type Tables<T extends keyof DB["public"]["Tables"]> =
  DB["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof DB["public"]["Tables"]> =
  DB["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof DB["public"]["Tables"]> =
  DB["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof DB["public"]["Enums"]> =
  DB["public"]["Enums"][T];

// Contoh khusus: type untuk tabel tertentu
export type Course = Tables<"courses">;
export type CourseInsert = TablesInsert<"courses">;
export type CourseUpdate = TablesUpdate<"courses">;

export type Profile = Tables<"profiles">;
export type Enrollment = Tables<"enrollments">;
