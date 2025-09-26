import { getNVQCategories } from "@/actions/course-actions";

export type NavigationDropdown = {
  href: string;
  label: string;
};

export type NavigationLink =
  | { href: string; label: string; dropdown?: undefined }
  | { label: string; dropdown: NavigationDropdown[]; href?: undefined };

export async function getNavigationLinks(): Promise<NavigationLink[]> {
  try {
    const categories = await getNVQCategories();

    return [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      {
        label: "NVQ",
        dropdown: [
          { href: "/nvq", label: "What is NVQ?" },
          ...categories.map((c: { slug: string; name: string }) => ({
            href: `/nvq/${c.slug}`,
            label: `${c.name} NVQs`,
          })),
        ],
      },
      {
        label: "Courses",
        dropdown: [
          ...categories.map((c: { slug: string; name: string }) => ({
            href: `/courses?category=${c.slug}`,
            label: c.name,
          })),
          { href: "/courses", label: "All Courses" },
        ],
      },
      { href: "/careers", label: "Careers" },
    ];
  } catch (error) {
    console.error("Failed to fetch categories:", error);

    // fallback ke static
    return [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      {
        label: "NVQ",
        dropdown: [{ href: "/nvq", label: "What is NVQ?" }],
      },
      {
        label: "Courses",
        dropdown: [{ href: "/courses", label: "All Courses" }],
      },
      { href: "/careers", label: "Careers" },
    ];
  }
}
