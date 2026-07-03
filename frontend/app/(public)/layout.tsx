import { Navbar } from "../customComponents/shared/Navbar/Navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main>
        <nav className="container mx-auto px-10">
          <Navbar />
        </nav>
          <div>{children}</div>
      </main>
    </>
  )
}
