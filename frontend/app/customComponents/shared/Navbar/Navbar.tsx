
"use client"

import Link from "next/link"
import Image from "next/image"
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
} from "lucide-react"
import { useSyncExternalStore } from "react"
import type { ElementType } from "react"

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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { cn } from "@/lib/utils"

import type { MenuItem } from "@/app/type"

import { menu, logo, auth } from "./NavLinks"

import { ThemeToggle } from "../ThemeToggle"
import LogoutButton from "./LogoutButton"

import { useAppSelector } from "@/app/redux/hooks"


/* =========================================================
   TYPES
========================================================= */

interface NavbarProps {
  className?: string
}


/* =========================================================
   HYDRATION
========================================================= */

const emptySubscribe = () => {
  return () => {}
}

const getServerSnapshot = () => false

const getClientSnapshot = () => true

function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot
  )
}


/* =========================================================
   USER INITIALS
========================================================= */

function getInitials(
  name?: string
) {
  if (!name) {
    return "ম"
  }

  const words = name
    .trim()
    .split(/\s+/)

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase()
  }

  return (
    words[0].charAt(0) +
    words[words.length - 1].charAt(0)
  ).toUpperCase()
}


/* =========================================================
   NAVBAR
========================================================= */

export function Navbar({
  className,
}: NavbarProps) {
  const {
    user,
    isAuthenticated,
    isLoading,
  } = useAppSelector(
    (state) => state.auth
  )

  const hydrated = useHydrated()

  /*
   * Don't render auth-dependent HTML
   * until hydration is complete.
   */
  const showAuthUI =
    hydrated && !isLoading

  const userName =
    user?.name || "ব্যবহারকারী"

  const userEmail =
    user?.email || ""


  return (
    <section
      className={cn(
        "container mx-auto md:px-10",
        className
      )}
    >

      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <nav className="hidden h-16 items-center justify-between lg:flex">

        {/* ===================================================
            LEFT
        =================================================== */}

        <div className="flex items-center gap-7">

          {/* LOGO */}

          <Link
            href={logo.url}
            className="group shrink-0"
          >
            <Image
              src={logo.src}
              alt={logo.title}
              width={120}
              height={120}
              className="h-auto w-auto transition-transform duration-200 group-hover:scale-[1.03]"
              priority
            />
          </Link>


          {/* NAVIGATION */}

          <NavigationMenu>
            <NavigationMenuList>
              {menu.map(renderMenuItem)}
            </NavigationMenuList>
          </NavigationMenu>

        </div>


        {/* ===================================================
            RIGHT
        =================================================== */}

        <div className="flex items-center gap-2">

          {/* THEME */}

          <ThemeToggle />


          {/* AUTH */}

          {!showAuthUI ? (

            /*
             * Same server/client placeholder.
             */
            <div
              className="h-10 w-36"
              aria-hidden="true"
            />

          ) : isAuthenticated && user ? (

            /* =================================================
               LOGGED IN
            ================================================= */

            <UserMenu
              name={userName}
              email={userEmail}
            />

          ) : (

            /* =================================================
               LOGGED OUT
            ================================================= */

            <div className="flex items-center gap-1.5">

              {/* LOGIN */}

              <Button
                variant="ghost"
                size="sm"
                asChild
                className="px-3"
              >
                <Link
                  href={auth.login.url}
                >
                  {auth.login.title}
                </Link>
              </Button>


              {/* REGISTER */}

              <Button
                size="sm"
                asChild
                className="rounded-lg px-4 shadow-sm"
              >
                <Link
                  href={auth.signup.url}
                >
                  {auth.signup.title}
                </Link>
              </Button>

            </div>
          )}

        </div>

      </nav>


      {/* =====================================================
          MOBILE
      ===================================================== */}

      <div className="block lg:hidden ">

        <div className="flex h-14 items-center justify-between">

          {/* LOGO */}

          <Link
            href={logo.url}
            className="shrink-0"
          >
            <Image
              src={logo.src}
              alt={logo.title}
              width={180}
              height={180}
              className="h-10 w-auto"
              priority
            />
          </Link>


          {/* RIGHT */}

          <div className="flex items-center gap-1.5">

            <ThemeToggle />


            {/* MOBILE AUTH */}

            {!showAuthUI ? (

              <div
                className="h-9 w-10"
                aria-hidden="true"
              />

            ) : isAuthenticated && user ? (

              <MobileUserButton
                name={userName}
              />

            ) : (

              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-lg"
              >
                <Link
                  href={auth.login.url}
                >
                  {auth.login.title}
                </Link>
              </Button>

            )}


            {/* MOBILE MENU */}

            <Sheet>

              <SheetTrigger className="border-none bg-none " asChild>

                <Button
                  variant="outline"
                  size="icon"
                  aria-label="মেনু খুলুন"
                  className="rounded-lg"
                >
                  <Menu className="size-4" />
                </Button>

              </SheetTrigger>


              <SheetContent
                side="right"
                className="w-75 overflow-y-auto px-4 sm:w-90"
              >

                <SheetHeader className="border-b pb-5">

                  <SheetTitle>
                    <Link
                      href={logo.url}
                    >
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

                  {/* =================================================
                      MOBILE MENU
                  ================================================= */}

                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                  >
                    {menu.map(
                      renderMobileMenuItem
                    )}
                  </Accordion>


                  {/* =================================================
                      MOBILE AUTH
                  ================================================= */}

                  <div className="mt-6 border-t pt-5">

                    {!showAuthUI ? null : isAuthenticated &&
                      user ? (

                      <div className="space-y-3">

                        {/* USER CARD */}

                        <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3">

                          <Avatar className="h-10 w-10 border">

                            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                              {getInitials(
                                userName
                              )}
                            </AvatarFallback>

                          </Avatar>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold">
                              {userName}
                            </p>

                            {userEmail && (
                              <p className="truncate text-xs text-muted-foreground">
                                {userEmail}
                              </p>
                            )}

                          </div>

                        </div>


                        {/* PROFILE */}

                        <Button
                          variant="outline"
                          asChild
                          className="w-full justify-start rounded-lg"
                        >
                          <Link
                            href="/profile"
                          >
                            <UserRound className="mr-2 size-4" />
                            প্রোফাইল
                          </Link>
                        </Button>


                        {/* DASHBOARD */}

                        <Button
                          variant="outline"
                          asChild
                          className="w-full justify-start rounded-lg"
                        >
                          <Link
                            href="/dashboard"
                          >
                            <LayoutDashboard className="mr-2 size-4" />
                            ড্যাশবোর্ড
                          </Link>
                        </Button>


                        {/* LOGOUT */}

                        <LogoutButton
                          className="flex w-full flex-row justify-start rounded-lg border px-4 py-2.5 text-sm"
                        />

                      </div>

                    ) : (

                      <div className="flex flex-col gap-2">

                        <Button
                          variant="outline"
                          asChild
                          className="w-full rounded-lg"
                        >
                          <Link
                            href={auth.login.url}
                          >
                            {auth.login.title}
                          </Link>
                        </Button>


                        <Button
                          asChild
                          className="w-full rounded-lg"
                        >
                          <Link
                            href={auth.signup.url}
                          >
                            {auth.signup.title}
                          </Link>
                        </Button>

                      </div>

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
   DESKTOP USER MENU
========================================================= */

function UserMenu({
  name,
  email,
}: {
  name: string
  email: string
}) {
  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <Button
          variant="ghost"
          className="group h-10 gap-2 rounded-xl px-2.5 hover:bg-muted/70"
        >

          {/* AVATAR */}

          <Avatar className="h-8 w-8 border">

            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {getInitials(name)}
            </AvatarFallback>

          </Avatar>


          {/* USER NAME */}

          <div className="hidden max-w-30 text-left xl:block">

            <p className="truncate text-sm font-medium leading-none">
              {name}
            </p>

            <p className="mt-1 truncate text-[10px] text-muted-foreground">
              অ্যাকাউন্ট
            </p>

          </div>


          <ChevronDown className="size-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />

        </Button>

      </DropdownMenuTrigger>


      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-xl p-2"
      >

        {/* ===================================================
            USER HEADER
        =================================================== */}

        <DropdownMenuLabel className="p-2">

          <div className="flex items-center gap-3">

            <Avatar className="h-10 w-10 border">

              <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                {getInitials(name)}
              </AvatarFallback>

            </Avatar>

            <div className="min-w-0">

              <p className="truncate text-sm font-semibold">
                {name}
              </p>

              {email && (
                <p className="truncate text-xs font-normal text-muted-foreground">
                  {email}
                </p>
              )}

            </div>

          </div>

        </DropdownMenuLabel>


        <DropdownMenuSeparator />


        {/* ===================================================
            DASHBOARD
        =================================================== */}

        <DropdownMenuItem
          asChild
          className="cursor-pointer rounded-lg"
        >
          <Link
            href="/dashboard"
            className="flex items-center"
          >
            <LayoutDashboard className="mr-2.5 size-4" />
            <span>ড্যাশবোর্ড</span>
          </Link>
        </DropdownMenuItem>


        {/* ===================================================
            PROFILE
        =================================================== */}

        <DropdownMenuItem
          asChild
          className="cursor-pointer rounded-lg"
        >
          <Link
            href="/profile"
            className="flex items-center"
          >
            <UserRound className="mr-2.5 size-4" />
            <span>প্রোফাইল</span>
          </Link>
        </DropdownMenuItem>


        <DropdownMenuSeparator />


        {/* ===================================================
            LOGOUT
        =================================================== */}

        <DropdownMenuItem
          asChild
          className="cursor-pointer rounded-lg p-0 focus:bg-destructive/10"
        >
          <div className="w-full">
            <LogoutButton
              className="flex w-full flex-row items-center justify-start border-0 px-2 py-2 text-sm text-destructive hover:bg-transparent"
            />
          </div>
        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>
  )
}


/* =========================================================
   MOBILE USER BUTTON
========================================================= */

function MobileUserButton({
  name,
}: {
  name: string
}) {
  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full p-0"
          aria-label="প্রোফাইল মেনু"
        >

          <Avatar className="h-8 w-8">

            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {getInitials(name)}
            </AvatarFallback>

          </Avatar>

        </Button>

      </DropdownMenuTrigger>


      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 rounded-xl p-2"
      >

        <DropdownMenuLabel className="px-3 py-2">
          <p className="truncate text-sm font-semibold">
            {name}
          </p>

          <p className="text-xs font-normal text-muted-foreground">
            আমার অ্যাকাউন্ট
          </p>
        </DropdownMenuLabel>


        <DropdownMenuSeparator />


        <DropdownMenuItem
          asChild
          className="rounded-lg"
        >
          <Link
            href="/dashboard"
            className="flex items-center"
          >
            <LayoutDashboard className="mr-2 size-4" />
            ড্যাশবোর্ড
          </Link>
        </DropdownMenuItem>


        <DropdownMenuItem
          asChild
          className="rounded-lg"
        >
          <Link
            href="/profile"
            className="flex items-center"
          >
            <UserRound className="mr-2 size-4" />
            প্রোফাইল
          </Link>
        </DropdownMenuItem>


        <DropdownMenuSeparator />


        <DropdownMenuItem
          asChild
          className="p-0 text-destructive focus:bg-destructive/10"
        >
          <div className="w-full">
            <LogoutButton
              className="flex w-full flex-row items-center justify-start border-0 px-2 py-2 text-sm text-destructive hover:bg-transparent"
            />
          </div>
        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>
  )
}


/* =========================================================
   DESKTOP MENU ITEM
========================================================= */

function renderMenuItem(
  item: MenuItem
) {
  if (item.items) {
    return (
      <NavigationMenuItem
        key={item.title}
      >

        <NavigationMenuTrigger className="h-9 bg-transparent px-3 text-sm font-medium">
          {item.title}
        </NavigationMenuTrigger>


        <NavigationMenuContent>

          <div className="grid gap-2 p-2">

            {item.items.map(
              (subItem) => (
                <NavigationMenuLink
                  key={subItem.title}
                  asChild
                  className="w-80"
                >
                  <SubMenuLink
                    item={subItem}
                  />
                </NavigationMenuLink>
              )
            )}

          </div>

        </NavigationMenuContent>

      </NavigationMenuItem>
    )
  }


  return (
    <NavigationMenuItem
      key={item.title}
    >

      <NavigationMenuLink
        asChild
      >

        <Link
          href={
            item.url || "#"
          }
          className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted"
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

function renderMobileMenuItem(
  item: MenuItem
) {
  if (item.items) {
    return (
      <AccordionItem
        key={item.title}
        value={item.title}
        className="border-b"
      >

        <AccordionTrigger className="py-3 text-sm font-medium">
          {item.title}
        </AccordionTrigger>


        <AccordionContent>

          <div className="flex flex-col gap-1 pb-2">

            {item.items.map(
              (subItem) => (
                <SubMenuLink
                  key={subItem.title}
                  item={subItem}
                />
              )
            )}

          </div>

        </AccordionContent>

      </AccordionItem>
    )
  }


  return (
    <Link
      key={item.title}
      href={
        item.url || "#"
      }
      className="block rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
    >
      {item.title}
    </Link>
  )
}


/* =========================================================
   SUB MENU LINK
========================================================= */

function SubMenuLink({
  item,
}: {
  item: MenuItem
}) {
  const Icon =
    item.icon as unknown as ElementType

  return (
    <Link
      href={
        item.url || "#"
      }
      className="flex gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
    >

      {item.icon && (
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
      )}


      <div className="min-w-0">

        <div className="font-semibold">
          {item.title}
        </div>

        {item.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {item.description}
          </p>
        )}

      </div>

    </Link>
  )
}
