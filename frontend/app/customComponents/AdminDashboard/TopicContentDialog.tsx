"use client"

import { useState } from "react"

import { Loader2, Pencil, Plus, Save } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { useUpsertTopicContentMutation } from "@/app/redux/api/topicContentApi"

interface TopicContent {
  _id: string
  bullets: string[]
  status: "draft" | "published"
}

interface TopicContentDialogProps {
  topicId: string
  topicTitle: string
  content?: TopicContent | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function TopicContentDialog({
  topicId,
  topicTitle,
  content,
  open,
  onOpenChange,
}: TopicContentDialogProps) {
  const [upsertTopicContent, { isLoading: isSaving }] =
    useUpsertTopicContentMutation()

  /*
   * IMPORTANT:
   *
   * One line = one bullet point.
   *
   * Commas inside a sentence are NOT separators.
   *
   * Example:
   *
   * চর্যাপদ মূলত **গানের সংকলন** ও **সাধনসংগীত**; এর প্রধান উদ্দেশ্য ছিল **ধর্মচর্চা ও সাধনা**।
   *
   * This remains ONE bullet.
   */

  const [bulletInput, setBulletInput] = useState(
    content?.bullets?.join("\n") ?? ""
  )

  // =========================================================
  // CONVERT TEXT -> BULLETS
  // =========================================================

  const previewBullets = bulletInput
    .split(/\r?\n/)
    .map((bullet) => bullet.trim())
    .filter(Boolean)

  const hasValidBullet = previewBullets.length > 0

  // =========================================================
  // SAVE
  // =========================================================

  const handleSave = async () => {
    if (!hasValidBullet || isSaving) return

    try {
      await upsertTopicContent({
        topicId,
        data: {
          bullets: previewBullets,
          status: "draft",
        },
      }).unwrap()

      onOpenChange(false)
    } catch (error) {
      console.error("Failed to save topic content:", error)
    }
  }

  // =========================================================
  // PUBLISH
  // =========================================================

  const handlePublish = async () => {
    if (!hasValidBullet || isSaving) return

    try {
      await upsertTopicContent({
        topicId,
        data: {
          bullets: previewBullets,
          status: "published",
        },
      }).unwrap()

      onOpenChange(false)
    } catch (error) {
      console.error("Failed to publish topic content:", error)
    }
  }

  const isEditing = !!content

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isSaving) {
          onOpenChange(value)
        }
      }}
    >
      <DialogContent className="max-w-4xl">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <Pencil className="h-5 w-5 text-primary" />
            ) : (
              <Plus className="h-5 w-5 text-primary" />
            )}

            {isEditing ? "Update Topic Content" : "Create Topic Content"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? `Update bullet points for "${topicTitle}".`
              : `Add study bullet points for "${topicTitle}".`}
          </DialogDescription>
        </DialogHeader>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="space-y-5 py-4">
          <div className="space-y-3">
            {/* LABEL */}

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="bullet-content">Bullet Points</Label>

                <p className="mt-1 text-[9px] text-muted-foreground">
                  প্রতিটি নতুন bullet point নতুন লাইনে লিখুন। কমা (,) ব্যবহার
                  করলে একই bullet-এর অংশ থাকবে।
                </p>
              </div>

              <div className="rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground">
                {previewBullets.length} bullet
                {previewBullets.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* =================================================
                INPUT
            ================================================= */}

            <Textarea
              id="bullet-content"
              value={bulletInput}
              onChange={(event) => setBulletInput(event.target.value)}
              placeholder={`চর্যাপদ মূলত **গানের সংকলন** ও **সাধনসংগীত**; এর প্রধান উদ্দেশ্য ছিল **ধর্মচর্চা ও সাধনা**।
চর্যাপদের কবিরা ছিলেন মূলত **সহজিয়া বৌদ্ধ** সম্প্রদায়ের সাধক।
চর্যাপদের **আদি পদ/প্রথম পদ** রচয়িতা **লুইপা**।
চর্যাপদের ভাষাকে **‘সন্ধ্যাভাষা’** বলা হয়।`}
              className="font-bangla min-h-[300px] resize-y text-[9px] leading-7"
              disabled={isSaving}
            />

            {/* TIP */}

            <div className="rounded-md bg-muted/50 px-3 py-3 text-xs leading-6 text-muted-foreground text-[9px]">
              <strong>Format:</strong>
              <br />
              প্রতিটি bullet point-এর জন্য একটি নতুন লাইন ব্যবহার করুন।
              <br />
              <strong>Comma (,)</strong> কোনো bullet-এর মধ্যে থাকলে সেটি আলাদা
              bullet হবে না।
              <br />
              <strong>Bold:</strong> গুরুত্বপূর্ণ শব্দের চারপাশে <code>**</code>{" "}
              ব্যবহার করুন।
            </div>

           
          </div>
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>

          {/* SAVE DRAFT */}

          <Button
            type="button"
            variant="secondary"
            onClick={handleSave}
            disabled={isSaving || !hasValidBullet}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Draft
          </Button>

          {/* PUBLISH */}

          <Button
            type="button"
            onClick={handlePublish}
            disabled={isSaving || !hasValidBullet}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// =============================================================
// SIMPLE MARKDOWN BOLD RENDERER
// =============================================================

function MarkdownText({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g)

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>
        }

        return <span key={index}>{part}</span>
      })}
    </>
  )
}
