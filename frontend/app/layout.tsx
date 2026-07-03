import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

import { Hind_Siliguri, Poppins } from "next/font/google"

const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bangla",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${poppins.variable} ${hind.variable}`}
    >
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
