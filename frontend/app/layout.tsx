
import "./globals.css"

import {
  Anek_Bangla,
  Hind_Siliguri,
  Poppins,
} from "next/font/google"

import Providers from "./providers/providers"

import { Toaster } from "@/components/ui/sonner"


/* =========================================================
   FONTS
========================================================= */

const anekBangla = Anek_Bangla({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-anek-bangla",
})

const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
})


/* =========================================================
   ROOT LAYOUT
========================================================= */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${poppins.variable} ${hind.variable} ${anekBangla.variable}`}
    >
      <body>
        <Providers>
          {children}
        </Providers>

        <Toaster />
      </body>
    </html>
  )
}
