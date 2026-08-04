import { ReactNode } from "react"

interface LayoutProps {
  children: ReactNode
}

export default function QuestionBanksLayout({ children }: LayoutProps) {
  return <main className="container mx-auto py-10">{children}</main>
}
