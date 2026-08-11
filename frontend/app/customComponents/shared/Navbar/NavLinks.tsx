import { Auth, Logo, MenuItem } from "@/app/type"

export const logo: Logo = {
  url: "/",
  src: "/medhahub-logo1.png",
  alt: "মেধাহাব লোগো",
  title: "মেধাহাব",
}

export const menu: MenuItem[] = [
  {
    title: "বিষয়সমূহ",
    url: "/subjects",
  },

  {
    title: "প্রশ্নব্যাংক",
    url: "/question-banks",
  },

  {
    title: "সাম্প্রতিক তথ্য",
    url: "/subject/current-affairs",
  },

  {
    title: "ড্যাশবোর্ড",
    url: "/dashboard",
  },
]

export const auth: Auth = {
  login: { title: "লগইন", url: "/login" },
  signup: { title: "সাইন আপ", url: "/register" },
}
