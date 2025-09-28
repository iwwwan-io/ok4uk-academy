import type { Metadata } from "next";
import type { JSX } from "react";

import UnderConstruction from "@/components/under-construction";
import AdminOverview from "@/components/admin/AdminOverview";
import UserDataTable from "@/components/admin/user-data-table";
import CourseManagementPage from "@/components/admin/course-management";
import AccountPage from "@/components/sections/account";
import AccountSettingsPage from "@/components/sections/account/account-settings";
import StudentOverview from "@/components/students/student-overview";
import AssessorOverview from "@/components/assessor/assessor-overview";

// 🔠 Capitalize util
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 🧱 Static params
export async function generateStaticParams() {
  const roles = ["admin", "student", "assessor"];
  const sections = [
    "overview",
    "users",
    "courses",
    "my-courses",
    "assigned-courses",
    "assign-assessors",
    "reports",
    "assessments",
    "payments",
    "progress",
    "certificates",
    "evidences",
    "account",
  ];

  return roles.flatMap((role) =>
    sections.map((section) => ({
      role,
      section: [section],
    }))
  );
}

type Role = "admin" | "student" | "assessor";

// 🧠 Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: Role; section?: string[] }>;
}): Promise<Metadata> {
  const { role, section = ["overview"] } = await params;
  const pageTitle = `${capitalize(role)} | ${capitalize(section[0])} Section`;

  return {
    title: pageTitle,
    description: `This is the ${section[0]} section for ${role}.`,
  };
}

// 🧩 Main Page Component
export default async function Page({
  params,
}: {
  params: Promise<{ role: string; section?: string[] }>;
}) {
  const { role: rawRole, section = ["overview"] } = await params;
  const role = rawRole.toLowerCase();
  const currentSection = section[0]; // e.g. "account"
  const subSectionId = section[1]; // e.g. "settings"

  const sectionRenderers: Record<
    string,
    Record<string, (id?: string) => JSX.Element>
  > = {
    admin: {
      overview: () => <AdminOverview />,
      users: () => <UserDataTable />,
      courses: () => <CourseManagementPage section={subSectionId} />,
      account: (sub) =>
        sub === "settings" ? <AccountSettingsPage /> : <AccountPage />,
    },
    student: {
      overview: () => <StudentOverview />,
      account: (sub) =>
        sub === "settings" ? <AccountSettingsPage /> : <AccountPage />,
    },
    assessor: {
      overview: () => <AssessorOverview />,
      account: (sub) =>
        sub === "settings" ? <AccountSettingsPage /> : <AccountPage />,
    },
  };

  const renderFn = sectionRenderers?.[role]?.[currentSection];

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {renderFn ? renderFn(subSectionId) : <UnderConstruction />}
    </section>
  );
}
