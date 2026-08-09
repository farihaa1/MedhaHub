"use client"

import { ChangeEvent, useRef, useState } from "react"
import Image from "next/image"

import { ImagePlus, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

/* =========================================================
   TYPES
========================================================= */

interface UploadResponseData {
  url?: string
}

interface UploadResponse {
  success?: boolean
  message?: string
  data?: UploadResponseData
}

interface QuestionImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  size?: "small" | "normal"
}

/* =========================================================
   UPLOAD URL
========================================================= */

const UPLOAD_URL = `${process.env.NEXT_PUBLIC_API_URL}/uploads/image`

/* =========================================================
   COMPONENT
========================================================= */

export default function QuestionImageUpload({
  value,
  onChange,
  label = "ছবি যোগ করুন",
  size = "normal",
}: QuestionImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [uploading, setUploading] = useState(false)

  /* =======================================================
     UPLOAD IMAGE
  ======================================================= */

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()

    formData.append("file", file)

    const response = await fetch(UPLOAD_URL, {
      method: "POST",
      body: formData,
      credentials: "include",
    })

    let result: UploadResponse

    try {
      result = (await response.json()) as UploadResponse
    } catch {
      throw new Error("সার্ভার থেকে সঠিক response পাওয়া যায়নি।")
    }

    if (!response.ok || result.success !== true) {
      throw new Error(result.message ?? "ছবি আপলোড করা যায়নি।")
    }

    const url = result.data?.url

    if (!url) {
      throw new Error("সার্ভার image URL ফেরত দেয়নি।")
    }

    return url
  }

  /* =======================================================
     FILE CHANGE
  ======================================================= */

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0]

    // Allow selecting the same file again
    event.target.value = ""

    if (!file) {
      return
    }

    /* -----------------------------------------------------
       TYPE VALIDATION
    ----------------------------------------------------- */

    if (!file.type.startsWith("image/")) {
      toast.error("শুধু image file নির্বাচন করুন।")
      return
    }

    /* -----------------------------------------------------
       SIZE VALIDATION
    ----------------------------------------------------- */

    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      toast.error("ছবির সর্বোচ্চ সাইজ ৫ MB হতে পারে।")
      return
    }

    /* -----------------------------------------------------
       UPLOAD
    ----------------------------------------------------- */

    try {
      setUploading(true)

      const url = await uploadImage(file)

      onChange(url)

      toast.success("ছবি সফলভাবে আপলোড হয়েছে।")
    } catch (error: unknown) {
      console.error("Image upload error:", error)

      const message =
        error instanceof Error ? error.message : "ছবি আপলোড করা যায়নি।"

      toast.error(message)
    } finally {
      setUploading(false)
    }
  }

  /* =======================================================
     REMOVE IMAGE
  ======================================================= */

  const handleRemove = (): void => {
    onChange("")
  }

  /* =======================================================
     SIZE
  ======================================================= */

  const isSmall = size === "small"

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* ---------------------------------------------------
          FILE INPUT
      --------------------------------------------------- */}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        className="hidden"
        disabled={uploading}
        onChange={handleFileChange}
      />

      {/* ---------------------------------------------------
          NO IMAGE
      --------------------------------------------------- */}

      {!value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <ImagePlus className="size-3.5" />
          )}

          {uploading ? "আপলোড হচ্ছে..." : label}
        </Button>
      )}

      {/* ---------------------------------------------------
          IMAGE PREVIEW
      --------------------------------------------------- */}

      {value && (
        <>
          <div className="relative inline-block">
            <div
              className={`relative overflow-hidden rounded-lg border bg-muted ${
                isSmall ? "size-12" : "h-28 w-28"
              }`}
            >
              <Image
                src={value}
                alt={label}
                fill
                sizes={isSmall ? "48px" : "112px"}
                className="object-cover"
                unoptimized
              />
            </div>

            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 size-6 rounded-full shadow-sm"
              disabled={uploading}
              onClick={handleRemove}
            >
              <X className="size-3" />
            </Button>
          </div>

          {/* ------------------------------------------------
              CHANGE IMAGE
          ------------------------------------------------ */}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <ImagePlus className="size-3.5" />
            )}

            {uploading ? "আপলোড হচ্ছে..." : "পরিবর্তন"}
          </Button>
        </>
      )}
    </div>
  )
}
