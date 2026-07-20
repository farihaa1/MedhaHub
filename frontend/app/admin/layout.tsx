import { ReactNode } from "react"
import { AdminNavbar } from "../customComponents/AdminDashboard/AdminNavbar/AdminNavbar"
import { AdminSidebar } from "../customComponents/AdminDashboard/AdminSidebar/AdminSidebar"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
