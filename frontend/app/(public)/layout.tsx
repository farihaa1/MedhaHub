import { Navbar } from "../customComponents/shared/Navbar/Navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar />
        </nav>
      </header>

      {children}
    </main>
  )
}
