
"use client"

import { useRef, useState } from "react"
import Image from "next/image"

import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  Mail,
  Pencil,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import {
  useMeQuery,
  useUpdateProfileMutation,
} from "@/app/redux/api/authApi"

import {
  useUploadImageMutation,
} from "@/app/redux/api/uploadApi"

import { useAppDispatch } from "@/app/redux/hooks"

import {
  setCredentials,
} from "@/app/redux/slices/authSlice"

import type { IUser } from "@/app/redux/types/auth.type"

// ============================================================
// PROFILE PAGE
// ============================================================

export default function ProfilePage() {
  const dispatch = useAppDispatch()

  // ==========================================================
  // CURRENT USER
  // ==========================================================

  const {
    data,
    isLoading: isMeLoading,
    isError,
    refetch,
  } = useMeQuery()

  // ==========================================================
  // UPDATE PROFILE
  // ==========================================================

  const [
    updateProfile,
    {
      isLoading: isUpdating,
    },
  ] = useUpdateProfileMutation()

  // ==========================================================
  // UPLOAD IMAGE
  // ==========================================================

  const [
    uploadImage,
    {
      isLoading: isUploadingImage,
    },
  ] = useUploadImageMutation()

  // ==========================================================
  // LOCAL STATE
  // ==========================================================

  const [editing, setEditing] = useState(false)

  const [name, setName] = useState("")

  const [serverError, setServerError] = useState("")

  const [successMessage, setSuccessMessage] = useState("")

  // ==========================================================
  // FILE INPUT
  // ==========================================================

  const fileInputRef =
    useRef<HTMLInputElement>(null)

  // ==========================================================
  // USER
  // ==========================================================

  const user = data?.data

  // ==========================================================
  // LOADING
  // ==========================================================

  if (isMeLoading) {
    return <ProfileLoading />
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (isError || !user) {
    return (
      <main className="min-h-full px-4 py-6 sm:px-6">
        <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <User className="h-5 w-5 text-destructive" />
              </div>

              <h1 className="mt-4 text-lg font-semibold">
                প্রোফাইল লোড করা যায়নি
              </h1>

              <p className="mt-2 text-xs text-muted-foreground">
                আপনার প্রোফাইল তথ্য লোড করতে সমস্যা হয়েছে।
              </p>

              <Button
                className="mt-5 h-9 text-xs"
                onClick={() => refetch()}
              >
                আবার চেষ্টা করুন
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  // ==========================================================
  // START EDITING
  // ==========================================================

  const handleStartEditing = () => {
    setName(user.name || "")
    setEditing(true)

    setServerError("")
    setSuccessMessage("")
  }

  // ==========================================================
  // CANCEL EDIT
  // ==========================================================

  const handleCancel = () => {
    setName(user.name || "")
    setEditing(false)

    setServerError("")
    setSuccessMessage("")
  }

  // ==========================================================
  // SAVE PROFILE
  // ==========================================================

  const handleSave = async () => {
    const trimmedName = name.trim()

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!trimmedName) {
      setServerError("নাম খালি রাখা যাবে না।")
      return
    }

    // --------------------------------------------------------
    // NOTHING CHANGED
    // --------------------------------------------------------

    if (trimmedName === (user.name || "")) {
      setEditing(false)
      return
    }

    try {
      setServerError("")
      setSuccessMessage("")

      // ------------------------------------------------------
      // UPDATE PROFILE
      // ------------------------------------------------------

      const response =
        await updateProfile({
          name: trimmedName,
        }).unwrap()

      // ------------------------------------------------------
      // UPDATE REDUX
      // ------------------------------------------------------

      if (response.data) {
        dispatch(
          setCredentials(
            response.data,
          ),
        )
      }

      setName(
        response.data?.name ||
          trimmedName,
      )

      setEditing(false)

      setSuccessMessage(
        "প্রোফাইল সফলভাবে আপডেট হয়েছে।",
      )

      // ------------------------------------------------------
      // REMOVE MESSAGE
      // ------------------------------------------------------

      window.setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      console.error(
        "PROFILE UPDATE ERROR:",
        error,
      )

      setServerError(
        getErrorMessage(error),
      )
    }
  }

  // ==========================================================
  // AVATAR CHANGE
  // ==========================================================

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    // --------------------------------------------------------
    // FILE TYPE
    // --------------------------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ]

    if (!allowedTypes.includes(file.type)) {
      setServerError(
        "শুধুমাত্র JPG, PNG এবং WEBP ছবি ব্যবহার করুন।",
      )

      event.target.value = ""
      return
    }

    // --------------------------------------------------------
    // FILE SIZE
    // --------------------------------------------------------

    if (file.size > 5 * 1024 * 1024) {
      setServerError(
        "ছবির সর্বোচ্চ সাইজ ৫ MB হতে পারে।",
      )

      event.target.value = ""
      return
    }

    try {
      setServerError("")
      setSuccessMessage("")

      // ------------------------------------------------------
      // FORM DATA
      // ------------------------------------------------------

      const formData = new FormData()

      formData.append(
        "file",
        file,
      )

      formData.append(
        "folder",
        "profile-images",
      )

      // ------------------------------------------------------
      // UPLOAD TO CLOUDINARY
      // ------------------------------------------------------

      const uploadResponse =
        await uploadImage(
          formData,
        ).unwrap()

      const avatarUrl =
        uploadResponse.data?.url

      if (!avatarUrl) {
        throw new Error(
          "Cloudinary image URL পাওয়া যায়নি।",
        )
      }

      // ------------------------------------------------------
      // SAVE AVATAR URL
      // ------------------------------------------------------

      const profileResponse =
        await updateProfile({
          avatar: avatarUrl,
        }).unwrap()

      // ------------------------------------------------------
      // UPDATE REDUX
      // ------------------------------------------------------

      if (profileResponse.data) {
        dispatch(
          setCredentials(
            profileResponse.data,
          ),
        )
      }

      // ------------------------------------------------------
      // REFRESH USER
      // ------------------------------------------------------

      await refetch()

      setSuccessMessage(
        "প্রোফাইল ছবি সফলভাবে আপডেট হয়েছে।",
      )

      window.setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      console.error(
        "AVATAR UPDATE ERROR:",
        error,
      )

      setServerError(
        getErrorMessage(error),
      )
    } finally {
      event.target.value = ""
    }
  }

  // ==========================================================
  // GOOGLE USER
  // ==========================================================

  const isGoogleUser =
    user.provider === "google"

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="min-h-full px-3 py-5 sm:px-5 sm:py-6">
      <div className="mx-auto max-w-4xl space-y-5">

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div>
          <h1 className="text-lg font-bold tracking-tight sm:text-xl lg:text-2xl">
            আমার প্রোফাইল
          </h1>

          <p className="mt-1 text-xs text-muted-foreground">
            আপনার অ্যাকাউন্টের তথ্য দেখুন এবং আপডেট করুন।
          </p>
        </div>

        {/* ==================================================
            PROFILE CARD
        ================================================== */}

        <Card className="overflow-hidden">

          {/* COVER */}

          <div className="h-20 bg-primary sm:h-24" />

          <CardContent className="px-4 pb-5 sm:px-6">

            {/* PROFILE HEADER */}

            <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">

              {/* AVATAR + NAME */}

              <div className="flex min-w-0 items-end gap-3 sm:gap-4">

                {/* AVATAR */}

                <div className="relative shrink-0">

                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-muted text-xl font-bold shadow-sm sm:h-24 sm:w-24 sm:text-2xl">

                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={
                          user.name ||
                          "Profile"
                        }
                        width={96}
                        height={96}
                        priority
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(
                        user.name,
                      )
                    )}

                  </div>

                  {/* FILE INPUT */}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={
                      handleAvatarChange
                    }
                    disabled={
                      isUploadingImage
                    }
                  />

                  {/* CHANGE AVATAR */}

                  <button
                    type="button"
                    disabled={
                      isUploadingImage
                    }
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    title="প্রোফাইল ছবি পরিবর্তন করুন"
                  >
                    {isUploadingImage ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Pencil className="h-3 w-3" />
                    )}
                  </button>

                </div>

                {/* USER NAME */}

                <div className="min-w-0 pb-1">

                  <h2 className="truncate text-base font-semibold sm:text-lg">
                    {user.name ||
                      "মেধাহাব ব্যবহারকারী"}
                  </h2>

                  <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">

                    <Mail className="h-3 w-3 shrink-0" />

                    <span className="max-w-[180px] truncate sm:max-w-[280px]">
                      {user.email ||
                        "ইমেইল নেই"}
                    </span>

                  </div>

                </div>

              </div>

              {/* EDIT BUTTON */}

              {!editing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 self-start text-xs sm:self-auto"
                  onClick={
                    handleStartEditing
                  }
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />

                  সম্পাদনা
                </Button>
              )}

            </div>

            {/* STATUS */}

            <div className="mt-4 flex flex-wrap gap-1.5">

              <StatusBadge
                icon={
                  <CheckCircle2 className="h-3 w-3" />
                }
                text={
                  user.status ===
                  "active"
                    ? "অ্যাকাউন্ট সক্রিয়"
                    : getStatusLabel(
                        user.status,
                      )
                }
              />

              {user.isVerified && (
                <StatusBadge
                  icon={
                    <ShieldCheck className="h-3 w-3" />
                  }
                  text="ইমেইল যাচাইকৃত"
                />
              )}

              {isGoogleUser && (
                <StatusBadge
                  icon={
                    <span className="text-[10px] font-bold">
                      G
                    </span>
                  }
                  text="Google"
                />
              )}

            </div>

          </CardContent>
        </Card>

        {/* ==================================================
            ERROR
        ================================================== */}

        {serverError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
            <p className="text-xs text-destructive">
              {serverError}
            </p>
          </div>
        )}

        {/* ==================================================
            SUCCESS
        ================================================== */}

        {successMessage && (
          <div className="rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2">
            <p className="text-xs text-green-600 dark:text-green-400">
              {successMessage}
            </p>
          </div>
        )}

        {/* ==================================================
            PERSONAL INFORMATION
        ================================================== */}

        <Card>

          <CardHeader className="border-b px-4 py-3 sm:px-5">
            <CardTitle className="text-sm font-semibold sm:text-base">
              ব্যক্তিগত তথ্য
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 sm:p-5">

            {editing ? (

              /* ==============================================
                 EDIT MODE
              ============================================== */

              <div className="space-y-4">

                {/* NAME */}

                <div>
                  <label
                    htmlFor="profile-name"
                    className="mb-1.5 block text-xs font-medium"
                  >
                    নাম
                  </label>

                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value,
                      )
                    }
                    disabled={isUpdating}
                    placeholder="আপনার নাম লিখুন"
                    autoComplete="name"
                    autoFocus
                    className="h-9 text-xs"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="profile-email"
                    className="mb-1.5 block text-xs font-medium"
                  >
                    ইমেইল
                  </label>

                  <Input
                    id="profile-email"
                    value={
                      user.email || ""
                    }
                    disabled
                    className="h-9 bg-muted text-xs"
                  />

                  <p className="mt-1 text-[10px] text-muted-foreground">
                    ইমেইল পরিবর্তন করা যাবে না।
                  </p>
                </div>

                {/* BUTTONS */}

                <div className="flex flex-wrap gap-2 pt-1">

                  <Button
                    size="sm"
                    onClick={
                      handleSave
                    }
                    disabled={
                      isUpdating
                    }
                    className="h-8 text-xs"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        সংরক্ষণ হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Save className="mr-1.5 h-3.5 w-3.5" />
                        সংরক্ষণ
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={
                      handleCancel
                    }
                    disabled={
                      isUpdating
                    }
                    className="h-8 text-xs"
                  >
                    <X className="mr-1.5 h-3.5 w-3.5" />
                    বাতিল
                  </Button>

                </div>

              </div>

            ) : (

              /* ==============================================
                 VIEW MODE
              ============================================== */

              <div className="grid gap-4 sm:grid-cols-2">

                <ProfileInfo
                  icon={
                    <User className="h-3.5 w-3.5" />
                  }
                  label="নাম"
                  value={
                    user.name ||
                    "তথ্য নেই"
                  }
                />

                <ProfileInfo
                  icon={
                    <Mail className="h-3.5 w-3.5" />
                  }
                  label="ইমেইল"
                  value={
                    user.email ||
                    "তথ্য নেই"
                  }
                />

                <ProfileInfo
                  icon={
                    <ShieldCheck className="h-3.5 w-3.5" />
                  }
                  label="অ্যাকাউন্ট"
                  value={getAccountStatus(
                    user,
                  )}
                />

                <ProfileInfo
                  icon={
                    <CalendarDays className="h-3.5 w-3.5" />
                  }
                  label="যোগদানের তারিখ"
                  value={formatDate(
                    user.createdAt,
                  )}
                />

              </div>
            )}

          </CardContent>
        </Card>

        {/* ==================================================
            ACCOUNT INFORMATION
        ================================================== */}

        <Card>

          <CardHeader className="border-b px-4 py-3 sm:px-5">
            <CardTitle className="text-sm font-semibold sm:text-base">
              অ্যাকাউন্ট তথ্য
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 sm:p-5">

            <div className="grid gap-4 sm:grid-cols-3">

              <SimpleInfo
                label="রোল"
                value={getRoleLabel(
                  user.role,
                )}
              />

              <SimpleInfo
                label="স্ট্যাটাস"
                value={getStatusLabel(
                  user.status,
                )}
              />

              <SimpleInfo
                label="লগইন পদ্ধতি"
                value={
                  user.provider ===
                  "google"
                    ? "Google"
                    : "ইমেইল ও পাসওয়ার্ড"
                }
              />

            </div>

          </CardContent>
        </Card>

      </div>
    </main>
  )
}

// ============================================================
// PROFILE INFO
// ============================================================

function ProfileInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground sm:text-xs">
          {label}
        </p>

        <p className="mt-0.5 truncate text-xs font-medium sm:text-sm">
          {value}
        </p>
      </div>

    </div>
  )
}

// ============================================================
// SIMPLE INFO
// ============================================================

function SimpleInfo({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground sm:text-xs">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium sm:text-sm">
        {value}
      </p>
    </div>
  )
}

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({
  icon,
  text,
}: {
  icon: React.ReactNode
  text: string
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] text-primary sm:text-xs">
      {icon}

      <span>{text}</span>
    </div>
  )
}

// ============================================================
// LOADING
// ============================================================

function ProfileLoading() {
  return (
    <main className="min-h-full px-3 py-5 sm:px-5 sm:py-6">
      <div className="mx-auto max-w-4xl space-y-5">

        {/* HEADER */}

        <div className="space-y-2">
          <div className="h-6 w-40 animate-pulse rounded bg-muted" />

          <div className="h-3 w-64 animate-pulse rounded bg-muted" />
        </div>

        {/* PROFILE */}

        <Card className="overflow-hidden">

          <div className="h-20 animate-pulse bg-muted sm:h-24" />

          <CardContent className="p-4 sm:p-5">

            <div className="-mt-10">

              <div className="h-20 w-20 animate-pulse rounded-full bg-muted sm:h-24 sm:w-24" />

            </div>

            <div className="mt-3 space-y-2">

              <div className="h-5 w-40 animate-pulse rounded bg-muted" />

              <div className="h-3 w-56 animate-pulse rounded bg-muted" />

            </div>

          </CardContent>
        </Card>

        {/* INFORMATION */}

        <Card>
          <CardContent className="grid gap-5 p-4 sm:grid-cols-2 sm:p-5">

            <div className="h-10 animate-pulse rounded bg-muted" />

            <div className="h-10 animate-pulse rounded bg-muted" />

            <div className="h-10 animate-pulse rounded bg-muted" />

            <div className="h-10 animate-pulse rounded bg-muted" />

          </CardContent>
        </Card>

      </div>
    </main>
  )
}

// ============================================================
// INITIALS
// ============================================================

function getInitials(
  name?: string,
) {
  if (!name?.trim()) {
    return "ম"
  }

  const words =
    name.trim().split(/\s+/)

  if (words.length === 1) {
    return words[0]
      .charAt(0)
      .toUpperCase()
  }

  return (
    words[0].charAt(0) +
    words[1].charAt(0)
  ).toUpperCase()
}

// ============================================================
// DATE
// ============================================================

function formatDate(
  date?: string,
) {
  if (!date) {
    return "তথ্য নেই"
  }

  const parsedDate =
    new Date(date)

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return "তথ্য নেই"
  }

  return new Intl.DateTimeFormat(
    "bn-BD",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    },
  ).format(parsedDate)
}

// ============================================================
// ACCOUNT STATUS
// ============================================================

function getAccountStatus(
  user: IUser,
) {
  if (user.status === "active") {
    return "সক্রিয়"
  }

  if (user.status === "blocked") {
    return "ব্লক করা হয়েছে"
  }

  if (user.status === "deleted") {
    return "ডিলিট করা হয়েছে"
  }

  return "তথ্য নেই"
}

// ============================================================
// ROLE
// ============================================================

function getRoleLabel(
  role: IUser["role"],
) {
  switch (role) {
    case "admin":
      return "অ্যাডমিন"

    case "premium":
      return "প্রিমিয়াম"

    case "user":
      return "সাধারণ ব্যবহারকারী"

    default:
      return role
  }
}

// ============================================================
// STATUS
// ============================================================

function getStatusLabel(
  status: IUser["status"],
) {
  switch (status) {
    case "active":
      return "সক্রিয়"

    case "blocked":
      return "ব্লক"

    case "deleted":
      return "ডিলিট"

    default:
      return status
  }
}

// ============================================================
// ERROR MESSAGE
// ============================================================

function getErrorMessage(
  error: unknown,
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error
  ) {
    const data = (
      error as {
        data?: {
          message?: string
        }
      }
    ).data

    if (data?.message) {
      return data.message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return "প্রোফাইল আপডেট করা যায়নি। আবার চেষ্টা করুন।"
}
