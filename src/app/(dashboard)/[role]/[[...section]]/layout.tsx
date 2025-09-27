export default function SectionLayout({
  children,
  nav,
}: {
  children: React.ReactNode
  nav: React.ReactNode
}) {
  return (
    <>
      <nav className="sticky top-0 border-b bg-background/60 supports-[backdrop-filter]:bg-background/60 z-50 backdrop-blur-xl">
        <div className=" py-2 sm:px-6 lg:px-8 ">{nav}</div>
      </nav>
      {children}
    </>
  )
}
