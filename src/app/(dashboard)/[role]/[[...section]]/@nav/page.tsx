import Link from 'next/link'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

// === Type definitions ===
type Role = 'admin' | 'assessor' | 'student'

interface MenuItem {
  label: string
  slug: string
}

// === Role-based menu configuration ===
const menuByRole: Record<Role, MenuItem[]> = {
  admin: [
    { label: 'Overview', slug: '' }, // Dashboard ringkasan
    { label: 'Users', slug: 'users' }, // Kelola pengguna
    { label: 'Courses', slug: 'courses' }, // Kelola semua kursus & kategori
    { label: 'Assign Assessors', slug: 'assign-assessors' }, // L
    { label: 'Reports', slug: 'reports' }, // Laporan enrollments, pembayaran, dll
  ],
  assessor: [
    { label: 'Overview', slug: '' }, // Ringkasan assessor
    { label: 'Assigned Courses', slug: 'assigned-courses' }, // Kursus yang ditugaskan
    { label: 'Assessments', slug: 'assessments' }, // Penilaian evidence per siswa
    { label: 'Payments', slug: 'payments' }, // Melihat pembayaran chapter oleh siswa
  ],
  student: [
    { label: 'Overview', slug: '' }, // Dashboard pribadi
    { label: 'My Courses', slug: 'my-courses' }, // Kursus yang di-enroll
    { label: 'Progress', slug: 'progress' }, // Progress belajar
    { label: 'Certificates', slug: 'certificates' }, // Sertifikat yang diperoleh
    { label: 'Payments', slug: 'payments' }, // Status pembayaran DP/chapter
    { label: 'Evidences', slug: 'evidences' }, // Pengumpulan & status evidence
  ],
}

// === Component ===
export default async function NavigationPage({
  params,
}: {
  params: Promise<{ role: Role; section?: string[] }>
}) {
  const { role, section = ['overview'] } = await params

  const menuItems = menuByRole[role] ?? []

  return (
    <ScrollArea>
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem className="overflow-x-auto whitespace-nowrap scrollbar-none">
            {menuItems.map(({ label, slug }) => {
              const href = `/${role}${slug ? `/${slug}` : ''}`
              const isActive = (section[0] === 'overview' && slug === '') || section[0] === slug

              return (
                <NavigationMenuLink
                  key={slug || 'overview'}
                  asChild
                  className={navigationMenuTriggerStyle({ className: 'bg-transparent' })}
                >
                  <Link
                    href={href}
                    className={cn(
                      'text-sm transition-colors',
                      isActive
                        ? 'font-semibold text-foreground'
                        : 'text-foreground/60 hover:text-foreground/80',
                    )}
                  >
                    {label}
                  </Link>
                </NavigationMenuLink>
              )
            })}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
