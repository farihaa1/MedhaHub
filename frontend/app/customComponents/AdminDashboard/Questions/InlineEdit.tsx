
"use client"

import { useState } from "react"
import { Check, Pencil, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface InlineTextEditProps {
  value: string
  onSave: (value: string) => Promise<void> | void
  placeholder?: string
  multiline?: boolean
}

export function InlineTextEditor({
  value,
  placeholder = "Enter text...",
  onSave,
  multiline = true,
}: InlineTextEditProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState("")
  const [saving, setSaving] = useState(false)

  function startEditing() {
    // Always take the latest Redux/parent value
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
      toast.error("Value cannot be empty")
      return
    }

    if (trimmed === value.trim()) {
      setEditing(false)
      return
    }

    try {
      setSaving(true)

      // Wait for RTK Query mutation
      await onSave(trimmed)

      // Close editor after successful API update
      setEditing(false)

      // Keep local draft synchronized with saved value
      setDraft(trimmed)
    } catch (error) {
      console.error("Inline save failed:", error)

      // Keep editor open so user does not lose their changes
      toast.error("Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <div className="group relative rounded-xl border border-border/60 bg-muted/20 p-4">
        <p
          className={`pr-8 text-sm leading-7 whitespace-pre-wrap ${
            value
              ? "text-foreground"
              : "text-muted-foreground italic"
          }`}
        >
          {value || placeholder}
        </p>

        <button
          type="button"
          onClick={startEditing}
          className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-md bg-background opacity-0 shadow-sm ring-1 ring-border transition-opacity group-hover:opacity-100"
          aria-label="Edit"
        >
          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        rows={multiline ? 5 : 2}
        autoFocus
        disabled={saving}
        className="resize-y border-border bg-background"
      />

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={cancel}
          disabled={saving}
        >
          <X className="mr-1.5 h-3.5 w-3.5" />
          Cancel
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={save}
          disabled={saving}
        >
          <Check className="mr-1.5 h-3.5 w-3.5" />

          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  )
}

