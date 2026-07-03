import { ReactNode } from "react"

export interface MenuItem {
  title: string
  url: string
  description?: string
  icon?: ReactNode
  items?: MenuItem[]
}

export interface Logo {
  url: string
  src: string
  alt: string
  title: string
  className?: string
}

export interface LoginButton {
  title: string
  url: string
}

export interface SignupButton {
  title: string
  url: string
}

export interface Auth {
  login: LoginButton
//   signup: SignupButton
}

export interface NavbarProps {
  className?: string
  logo: Logo
  menu: MenuItem[]
  auth: Auth
}
