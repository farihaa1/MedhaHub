"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Button } from "@/components/ui/button"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { cn } from "@/lib/utils"

import { MenuItem } from "@/app/type"

import { menu, logo, auth } from "./NavLinks"

import { ThemeToggle } from "../ThemeToggle"
import LogoutButton from "./LogoutButton"

import { useAppSelector } from "@/app/redux/hooks"

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  )

  return (
    <section className={cn("", className)}>
      <div className="container">
        {/* ================= Desktop ================= */}

        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            <Link href={logo.url}>
              <Image
                src={logo.src}
                alt={logo.title}
                width={120}
                height={120}
                className="h-auto w-auto"
                loading="eager"
                priority
              />
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                {menu.map(renderMenuItem)}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/profile">{user?.name ?? "Profile"}</Link>
                    </Button>

                    <LogoutButton />
                  </>
                ) : (
                  <>
                    <Link
                      href={auth.login.url}
                      className="flex h-9 items-center rounded-md px-3 text-sm font-medium hover:bg-muted"
                    >
                      {auth.login.title}
                    </Link>

                    <Button asChild size="sm">
                      <Link href={auth.signup.url}>{auth.signup.title}</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </nav>

        {/* ================= Mobile ================= */}

        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={logo.url}>
              <Image
                src={logo.src}
                alt={logo.title}
                width={180}
                height={180}
                className="h-10 w-auto"
                loading="eager"
                priority
              />
            </Link>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/profile">{user?.name ?? "Profile"}</Link>
                      </Button>

                      <LogoutButton />
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={auth.login.url}>{auth.login.title}</Link>
                      </Button>

                      <Button
                        asChild
                        size="sm"
                        className="hidden sm:inline-flex"
                      >
                        <Link href={auth.signup.url}>{auth.signup.title}</Link>
                      </Button>
                    </>
                  )}
                </>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>

                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href={logo.url}>
                        <Image
                          src={logo.src}
                          alt={logo.title}
                          width={160}
                          height={160}
                          className="h-10 w-auto"
                          loading="eager"
                          priority
                        />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-6">
                    <Accordion type="single" collapsible>
                      {menu.map(renderMobileMenuItem)}
                    </Accordion>

                    <div className="mt-6 flex flex-col gap-2">
                      {!isLoading && (
                        <>
                          {isAuthenticated ? (
                            <>
                              <Button asChild>
                                <Link href="/profile">
                                  {user?.name ?? "Profile"}
                                </Link>
                              </Button>

                              <LogoutButton className="flex flex-col rounded-md border px-4 py-2" />
                            </>
                          ) : (
                            <>
                              <Button variant="outline" asChild>
                                <Link href="/login">Login</Link>
                              </Button>

                              <Button asChild>
                                <Link href="/signup">Signup</Link>
                              </Button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function renderMenuItem(item: MenuItem) {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>

        <NavigationMenuContent>
          {item.items.map((subItem) => (
            <NavigationMenuLink key={subItem.title} asChild className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 items-center rounded-md px-4 text-sm font-medium hover:bg-muted"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

function renderMobileMenuItem(item: MenuItem) {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title}>
        <AccordionTrigger>{item.title}</AccordionTrigger>

        <AccordionContent>
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <Link key={item.title} href={item.url} className="block py-2 font-medium">
      {item.title}
    </Link>
  )
}

function SubMenuLink({ item }: { item: MenuItem }) {
  return (
    <Link href={item.url} className="flex gap-4 rounded-md p-3 hover:bg-muted">
      <div>{item.icon}</div>

      <div>
        <div className="font-semibold">{item.title}</div>

        {item.description && (
          <p className="text-xs text-muted-foreground">{item.description}</p>
        )}
      </div>
    </Link>
  )
}
