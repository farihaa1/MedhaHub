import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Anek_Bangla, Hind_Siliguri, Poppins } from "next/font/google"
import Providers from "./providers/providers"
import { Toaster } from "@/components/ui/sonner"

const anekBangla = Anek_Bangla({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-anek-bangla",
})

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
      className={`${poppins.variable} ${hind.variable} ${anekBangla.variable}`}
    >
      <body className="font-on font-sans">
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children} <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
