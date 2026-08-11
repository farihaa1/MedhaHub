"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Pencil, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { QuestionSourceType } from "@/app/redux/api/questionsApi"

/* ============================================================
   SOURCE TYPE OPTIONS
   Comes directly from backend-compatible enum values
============================================================ */

const sourceTypeOptions = Object.entries(QuestionSourceType).map(
  ([key, value]) => ({
    key,
    value,
    label: key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()),
  })
)

/* ============================================================
   INLINE TEXT EDITOR
============================================================ */

interface InlineTextEditorProps {
  value: string
  placeholder?: string
  onSave: (value: string) => Promise<void>
  multiline?: boolean
}

export function InlineTextEditor({
  value,
  placeholder = "Click to edit...",
  onSave,
  multiline = true,
}: InlineTextEditorProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  function startEditing() {
    setDraft(value)
    setEditing(true)
  }

  function cancel() {
    setDraft(value)
    setEditing(false)
  }

  async function save() {
    const trimmed = draft.trim()

    if (!trimmed) {
      return
    }

    if (trimmed === value.trim()) {
      setEditing(false)
      return
    }

    try {
      setSaving(true)

      await onSave(trimmed)

      setEditing(false)
    } catch {
      // Parent handles the error.
    } finally {
      setSaving(false)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault()
      void save()
    }

    if (event.key === "Escape") {
      event.preventDefault()
      cancel()
    }
  }

  if (!editing) {
    return (
      <div
        className="group relative cursor-pointer rounded-xl border border-border/60 bg-muted/20 p-4 transition-colors hover:bg-muted/40"
        onClick={startEditing}
      >
        <div className="pr-8">
          {value ? (
            <p className="text-sm leading-6 whitespace-pre-wrap">{value}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {placeholder}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            startEditing()
          }}
          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-md bg-background opacity-0 shadow-sm ring-1 ring-border transition-opacity group-hover:opacity-100"
          aria-label="Edit text"
        >
          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-xl border border-primary/30 bg-muted/20 p-4">
      <Textarea
        ref={textareaRef}
        value={draft}
        disabled={saving}
        autoFocus
        onChange={(event) => {
          setDraft(event.target.value)
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-h-[120px] resize-y bg-background"
      />

      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">
          Ctrl + Enter to save · Esc to cancel
        </p>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={saving}
            onClick={cancel}
          >
            <X className="mr-1.5 h-3.5 w-3.5" />
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={saving || !draft.trim()}
            onClick={() => {
              void save()
            }}
          >
            <Check className="mr-1.5 h-3.5 w-3.5" />

            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  )
}
