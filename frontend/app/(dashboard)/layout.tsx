import type { ReactNode } from "react"

import { SidebarProvider } from "@/components/ui/sidebar"

import DashboardSidebar from "@/app/customComponents/Dashboard/customBlocks/Navbar/DashboardSidebar"
import Header from "@/app/customComponents/Dashboard/customBlocks/Header/Header"
import FacebookIcon from "@/public/svg/facebook-icon"
import InstagramIcon from "@/public/svg/instagram-icon"
import LinkedinIcon from "@/public/svg/linkedin"
import TwitterIcon from "@/public/svg/twitter-icon"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <div>
          <DashboardSidebar />
        </div>

        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-auto">{children}</main>
          <footer>
            <div className="mx-auto flex size-full max-w-7xl items-center justify-between gap-3 px-4 py-3 text-muted-foreground max-sm:flex-col sm:gap-6 sm:px-6">
              <p className="text-sm text-balance max-sm:text-center">
                {`©${new Date().getFullYear()}`}{" "}
                <a href="#" className="text-primary">
                  shadcn/studio
                </a>
                , Made for better web design
              </p>
              <div className="flex items-center gap-5 text-muted-foreground *:hover:text-primary">
                <a href="#">
                  <FacebookIcon className="size-4" />
                </a>
                <a href="#">
                  <InstagramIcon className="size-4" />
                </a>
                <a href="#">
                  <LinkedinIcon className="size-4" />
                </a>
                <a href="#">
                  <TwitterIcon className="size-4" />
                </a>
              </div>
            </div>
          </footer>{" "}
        </div>
      </div>
    </SidebarProvider>
  )
}
