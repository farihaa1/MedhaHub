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

  /*
   * During authentication loading:
   *
   * Server:
   * isLoading = true
   *
   * First client render:
   * isLoading = true
   *
   * Therefore the HTML is identical.
   */
  const showAuthUI = !isLoading

  return (
    <section className={cn("", className)}>
      {/* =========================================================
          DESKTOP
      ========================================================= */}

      <nav className="hidden items-center justify-between lg:flex">
        <div className="flex items-center gap-6">
          {/* Logo */}

          <Link href={logo.url}>
            <Image
              src={logo.src}
              alt={logo.title}
              width={120}
              height={120}
              className="h-auto w-auto"
              priority
            />
          </Link>

          {/* Navigation */}

          <NavigationMenu>
            <NavigationMenuList>{menu.map(renderMenuItem)}</NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side */}

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {showAuthUI && (
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

      {/* =========================================================
          MOBILE
      ========================================================= */}

      <div className="block lg:hidden">
        <div className="flex items-center justify-between">
          {/* Logo */}

          <Link href={logo.url}>
            <Image
              src={logo.src}
              alt={logo.title}
              width={180}
              height={180}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Right */}

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {showAuthUI && (
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

                    <Button asChild size="sm" className="hidden sm:inline-flex">
                      <Link href={auth.signup.url}>{auth.signup.title}</Link>
                    </Button>
                  </>
                )}
              </>
            )}

            {/* Mobile menu */}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu">
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
                    {showAuthUI && (
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
                              <Link href={auth.login.url}>
                                {auth.login.title}
                              </Link>
                            </Button>

                            <Button asChild>
                              <Link href={auth.signup.url}>
                                {auth.signup.title}
                              </Link>
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
    </section>
  )
}

/* =========================================================
   DESKTOP MENU ITEM
========================================================= */

function renderMenuItem(item: MenuItem) {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>

        <NavigationMenuContent>
          <div className="grid gap-2 p-2">
            {item.items.map((subItem) => (
              <NavigationMenuLink key={subItem.title} asChild className="w-80">
                <SubMenuLink item={subItem} />
              </NavigationMenuLink>
            ))}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <Link
          href={item.url}
          className="inline-flex h-9 items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          {item.title}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

/* =========================================================
   MOBILE MENU ITEM
========================================================= */

function renderMobileMenuItem(item: MenuItem) {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title}>
        <AccordionTrigger>{item.title}</AccordionTrigger>

        <AccordionContent>
          <div className="flex flex-col gap-1">
            {item.items.map((subItem) => (
              <SubMenuLink key={subItem.title} item={subItem} />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <div key={item.title} className="py-1">
      <Link
        href={item.url}
        className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
      >
        {item.title}
      </Link>
    </div>
  )
}

/* =========================================================
   SUB MENU LINK
========================================================= */

function SubMenuLink({ item }: { item: MenuItem }) {
  return (
    <Link
      href={item.url}
      className="flex items-start gap-3 rounded-md p-3 hover:bg-muted"
    >
      {item.icon && <span className="mt-0.5 shrink-0">{item.icon}</span>}

      <div>
        <div className="font-semibold">{item.title}</div>

        {item.description && (
          <p className="text-xs text-muted-foreground">{item.description}</p>
        )}
      </div>
    </Link>
  )
}
