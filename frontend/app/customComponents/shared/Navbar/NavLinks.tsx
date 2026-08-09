import { Auth, Logo, MenuItem } from "@/app/type"

export const logo: Logo = {
  url: "/",
  src: "/medhahub-logo1.png",
  alt: "মেধাহাব লোগো",
  title: "মেধাহাব",
}

export const menu: MenuItem[] = [
  // ─────────────────────────────────────
  // বিষয়সমূহ
  // ─────────────────────────────────────
  {
    title: "বিষয়সমূহ",
    url: "/subjects",
  },

  // ─────────────────────────────────────
  // প্রশ্নব্যাংক
  // ─────────────────────────────────────
  {
    title: "প্রশ্নব্যাংক",
    url: "/question-banks",
  },

  // ─────────────────────────────────────
  // সাম্প্রতিক তথ্য
  // ─────────────────────────────────────
  {
    title: "সাম্প্রতিক তথ্য",
    url: "/subject/current-affairs",
  },

  // ─────────────────────────────────────
  // ড্যাশবোর্ড
  // ─────────────────────────────────────
  {
    title: "ড্যাশবোর্ড",
    url: "/dashboard",
  },
]

export const auth: Auth = {
  login: {
    title: "লগইন",
    url: "/login",
  },

  signup: {
    title: "নিবন্ধন",
    url: "/signup",
  },
}
