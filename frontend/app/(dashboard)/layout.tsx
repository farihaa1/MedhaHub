"use client"

import type { ReactNode } from "react"

import { SidebarProvider } from "@/components/ui/sidebar"

import DashboardSidebar from "@/app/customComponents/Dashboard/customBlocks/Navbar/DashboardSidebar"
import Header from "@/app/customComponents/Dashboard/customBlocks/Header/Header"
import ProtectedRoute from "../(public)/(auth)/components/ProtectedRoute"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <DashboardSidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <Header />

          <main className="flex-1 overflow-auto">{children}</main>

          <footer className="border-t bg-muted/20 px-18 py-4 text-center">
            {/* BOTTOM */}
            <div className="flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
              <p>
                © {new Date().getFullYear()}{" "}
                <span className="font-medium text-foreground">মেধাহাব</span>.
                সর্বস্বত্ব সংরক্ষিত।
              </p>

              <p className="text-center sm:text-right">
                শেখো • অনুশীলন করো • এগিয়ে যাও
              </p>
            </div>
          </footer>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
