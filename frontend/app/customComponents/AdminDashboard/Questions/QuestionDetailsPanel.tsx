"use client"

import { useState } from "react"
import Image from "next/image"
import {
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  FileText,
  Hash,
  Pencil,
  Plus,
  Tag,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
  IQuestion,
  IEntityRef,
  IEntityValue,
  useUpdateQuestionMutation,
} from "@/app/redux/api/questionsApi"

import PreviewQuestionDialog from "./PreviewQuestionDialog"
import DeleteQuestionDialog from "./DeleteQuestionDialog"
import AddToQuestionBankDialog from "./AddToQuestionBankDialog"
import { InlineTextEditor } from "./InlineEdit"

interface Props {
  question: IQuestion | null
}

interface EditableOption {
  text: string
  image?: string | null
  isCorrect: boolean
}

interface EditableSource {
  name: string
  type: string
  year?: number
}

/* ============================================================
   HELPERS
============================================================ */

function getTitle(
  value: string | IEntityRef | IEntityValue | null | undefined,
): string {
  if (!value) {
    return "-"
  }

  if (typeof value === "string") {
    return value
  }

  return value.title
}

function getDifficultyClass(
  difficulty: string | undefined,
): string {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"

    case "medium":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400"

    case "hard":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400"

    default:
      return "bg-muted text-muted-foreground"
  }
}

function getStatusClass(
  status: string | undefined,
): string {
  switch (status?.toLowerCase()) {
    case "published":
    case "approved":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"

    case "draft":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400"

    case "rejected":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400"

    default:
      return "bg-muted text-muted-foreground"
  }
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function QuestionDetailsPanel({
  question,
}: Props) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [bankOpen, setBankOpen] = useState(false)

  const [updateQuestion] = useUpdateQuestionMutation()

  /* ==========================================================
     GENERIC UPDATE
  ========================================================== */

  async function updateField(
    data: Record<string, unknown>,
  ): Promise<void> {
    if (!question?._id) {
      return
    }

    try {
      await updateQuestion({
        id: question._id,
        data,
      }).unwrap()

      toast.success("Question updated successfully")
    } catch (error) {
      console.error(error)

      toast.error("Failed to update question")

      throw error
    }
  }

  /* ==========================================================
     EMPTY STATE
  ========================================================== */

  if (!question) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>

          <h3 className="mt-4 text-base font-semibold">
            Select a question
          </h3>

          <p className="mt-2 max-w-[280px] text-sm leading-6 text-muted-foreground">
            Select a question from the table to view and edit its
            details.
          </p>
        </div>
      </div>
    )
  }

  /*
   * Normalize difficulty here.
   *
   * This fixes:
   *
   * Type 'QuestionDifficulty | undefined'
   * is not assignable to type 'string'
   */
  const difficulty = question.difficulty ?? "easy"

  return (
    <>
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="shrink-0 border-b border-border/60 bg-card px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Hash className="h-3.5 w-3.5" />
              </span>

              <span className="truncate text-xs font-medium text-muted-foreground">
                {question._id}
              </span>
            </div>

            <h2 className="text-base font-semibold tracking-tight">
              Question Details
            </h2>
          </div>

          <Badge
            variant="secondary"
            className="shrink-0 capitalize"
          >
            {question.type}
          </Badge>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {/* Status */}

          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${getStatusClass(
              question.status,
            )}`}
          >
            {question.status}
          </span>

          {/* Difficulty */}

          <InlineDifficulty
            value={difficulty}
            onSave={(value) =>
              updateField({
                difficulty: value,
              })
            }
          />
        </div>
      </div>

      {/* ==================================================
          ACTION BAR
      ================================================== */}

      <div className="flex shrink-0 flex-wrap gap-2 border-b border-border/60 bg-muted/20 px-5 py-3">
        <Button
          size="sm"
          className="h-9"
          onClick={() => setPreviewOpen(true)}
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          Preview
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="h-9 bg-background"
          onClick={() => setBankOpen(true)}
        >
          <BookOpen className="mr-1.5 h-3.5 w-3.5" />
          Bank
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="h-9 bg-background"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                question.questionText ?? "",
              )

              toast.success("Question copied")
            } catch {
              toast.error("Failed to copy question")
            }
          }}
        >
          <Copy className="mr-1.5 h-3.5 w-3.5" />
          Copy
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="h-9 border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          Delete
        </Button>
      </div>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-7 p-5">
          {/* =================================================
              ACADEMIC CONTEXT
          ================================================== */}

          <section>
            <SectionHeader
              icon={BookOpen}
              title="Academic Context"
            />

            <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/20">
              <div className="grid grid-cols-1 divide-y divide-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <AcademicItem
                  label="Subject"
                  value={getTitle(question.subjectId)}
                />

                <AcademicItem
                  label="Chapter"
                  value={getTitle(question.chapterId)}
                />

                <AcademicItem
                  label="Topic"
                  value={getTitle(question.topicId)}
                />
              </div>
            </div>
          </section>

          {/* =================================================
              QUESTION
          ================================================== */}

          <section>
            <SectionHeader
              icon={FileText}
              title="Question"
              hint="Click the text to edit"
            />

            <InlineTextEditor
              value={question.questionText ?? ""}
              placeholder="Enter question..."
              onSave={(value) =>
                updateField({
                  questionText: value,
                })
              }
            />

            {question.questionImage && (
              <div className="mt-3 overflow-hidden rounded-xl border border-border/60 bg-muted/20">
                <Image
                  src={question.questionImage}
                  alt="Question"
                  width={800}
                  height={500}
                  className="h-auto w-full object-contain"
                />
              </div>
            )}
          </section>

          {/* =================================================
              OPTIONS
          ================================================== */}

          <section>
            <SectionHeader
              icon={CheckCircle2}
              title="Answer Options"
              hint={`${question.options?.length ?? 0} options`}
            />

            <InlineOptionsEditor
              options={(question.options ?? []) as EditableOption[]}
              onSave={(options) =>
                updateField({
                  options,
                })
              }
            />
          </section>

          {/* =================================================
              EXPLANATION
          ================================================== */}

          <section>
            <SectionHeader
              icon={CheckCircle2}
              title="Explanation"
              hint="Click the text to edit"
            />

            <InlineTextEditor
              value={question.explanation ?? ""}
              placeholder="Add an explanation..."
              onSave={(value) =>
                updateField({
                  explanation: value,
                })
              }
            />

            {question.explanationImage && (
              <div className="mt-3 overflow-hidden rounded-xl border border-border/60 bg-muted/20">
                <Image
                  src={question.explanationImage}
                  alt="Explanation"
                  width={700}
                  height={400}
                  className="h-auto w-full object-contain"
                />
              </div>
            )}
          </section>

          {/* =================================================
              TAGS
          ================================================== */}

          <section>
            <SectionHeader
              icon={Tag}
              title="Tags"
              hint="Click to edit"
            />

            <InlineTagsEditor
              tags={question.tags ?? []}
              onSave={(tags) =>
                updateField({
                  tags,
                })
              }
            />
          </section>

          {/* =================================================
              SOURCES
          ================================================== */}

          <section>
            <SectionHeader
              icon={BookOpen}
              title="Sources"
              hint={
                question.sources?.length
                  ? `${question.sources.length} sources`
                  : "Click to add"
              }
            />

            <InlineSourcesEditor
              sources={
                (question.sources ?? []) as EditableSource[]
              }
              onSave={(sources) =>
                updateField({
                  sources,
                })
              }
            />
          </section>

          {/* =================================================
              METADATA
          ================================================== */}

          <section className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <MetadataItem
                icon={Calendar}
                label="Created"
                value={new Date(
                  question.createdAt,
                ).toLocaleString()}
              />

              <MetadataItem
                icon={Clock}
                label="Updated"
                value={new Date(
                  question.updatedAt,
                ).toLocaleString()}
              />
            </div>
          </section>
        </div>
      </ScrollArea>

      {/* ======================================================
          DIALOGS
      ======================================================= */}

      <PreviewQuestionDialog
        questionId={question._id}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />

      <AddToQuestionBankDialog
        questionId={question._id}
        open={bankOpen}
        onOpenChange={setBankOpen}
      />

      <DeleteQuestionDialog
        question={question}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}

/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({
  icon: Icon,
  title,
  hint,
}: {
  icon: typeof BookOpen
  title: string
  hint?: string
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />

        <h3 className="text-sm font-semibold">
          {title}
        </h3>
      </div>

      {hint && (
        <span className="text-[10px] text-muted-foreground">
          {hint}
        </span>
      )}
    </div>
  )
}

/* ============================================================
   INLINE DIFFICULTY
============================================================ */

function InlineDifficulty({
  value,
  onSave,
}: {
  value: string
  onSave: (value: string) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)

  function startEditing() {
    setDraft(value)
    setEditing(true)
  }

  function cancel() {
    setDraft(value)
    setEditing(false)
  }

  async function save(valueToSave: string) {
    if (valueToSave === value) {
      setEditing(false)
      return
    }

    try {
      setSaving(true)

      await onSave(valueToSave)

      setDraft(valueToSave)
      setEditing(false)
    } catch {
      // Parent handles the error.
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={startEditing}
        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize transition-opacity hover:opacity-80 ${getDifficultyClass(
          value,
        )}`}
      >
        {value}

        <Pencil className="h-3 w-3 opacity-60" />
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1">
      {["easy", "medium", "hard"].map((item) => (
        <button
          key={item}
          type="button"
          disabled={saving}
          onClick={() => save(item)}
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize transition-all ${
            draft === item
              ? getDifficultyClass(item)
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {item}
        </button>
      ))}

      <button
        type="button"
        disabled={saving}
        onClick={cancel}
        className="ml-1 rounded-md p-1 text-muted-foreground hover:bg-muted"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}

/* ============================================================
   INLINE OPTIONS EDITOR
============================================================ */

function InlineOptionsEditor({
  options,
  onSave,
}: {
  options: EditableOption[]
  onSave: (options: EditableOption[]) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<EditableOption[]>([])
  const [saving, setSaving] = useState(false)

  function cloneOptions(
    source: EditableOption[],
  ): EditableOption[] {
    return source.map((option) => ({
      ...option,
    }))
  }

  function startEditing() {
    setDraft(cloneOptions(options))
    setEditing(true)
  }

  function cancel() {
    setDraft(cloneOptions(options))
    setEditing(false)
  }

  function updateText(
    index: number,
    text: string,
  ) {
    setDraft((current) =>
      current.map((option, i) =>
        i === index
          ? {
              ...option,
              text,
            }
          : option,
      ),
    )
  }

  function setCorrect(index: number) {
    setDraft((current) =>
      current.map((option, i) => ({
        ...option,
        isCorrect: i === index,
      })),
    )
  }

  function removeOption(index: number) {
    setDraft((current) =>
      current.filter((_, i) => i !== index),
    )
  }

  function addOption() {
    setDraft((current) => [
      ...current,
      {
        text: "",
        image: null,
        isCorrect: false,
      },
    ])
  }

  async function save() {
    if (draft.length < 2) {
      toast.error("At least 2 options are required")
      return
    }

    if (draft.some((option) => !option.text.trim())) {
      toast.error("All options must have text")
      return
    }

    if (!draft.some((option) => option.isCorrect)) {
      toast.error("Please select a correct answer")
      return
    }

    try {
      setSaving(true)

      await onSave(draft)

      setEditing(false)
    } catch {
      // Parent handles the error.
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <div className="group relative">
        {options.length === 0 ? (
          <button
            type="button"
            onClick={startEditing}
            className="flex w-full items-center justify-center rounded-xl border border-dashed border-border py-6 text-sm text-muted-foreground transition-colors hover:bg-muted/30"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add options
          </button>
        ) : (
          <div className="space-y-2">
            {options.map((option, index) => {
              const letter = String.fromCharCode(
                65 + index,
              )

              return (
                <div
                  key={index}
                  className={`flex gap-3 rounded-xl border p-3 transition-colors ${
                    option.isCorrect
                      ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10"
                      : "border-border/60 bg-background"
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                      option.isCorrect
                        ? "bg-emerald-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {option.isCorrect ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      letter
                    )}
                  </div>

                  <p className="min-w-0 flex-1 text-sm leading-6">
                    {option.text}
                  </p>

                  {option.isCorrect && (
                    <span className="shrink-0 self-start rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Correct
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {options.length > 0 && (
          <button
            type="button"
            onClick={startEditing}
            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-md bg-background opacity-0 shadow-sm ring-1 ring-border transition-opacity group-hover:opacity-100"
            aria-label="Edit options"
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
      {draft.map((option, index) => {
        const letter = String.fromCharCode(
          65 + index,
        )

        return (
          <div
            key={index}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              disabled={saving}
              onClick={() => setCorrect(index)}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                option.isCorrect
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {option.isCorrect ? (
                <Check className="h-4 w-4" />
              ) : (
                letter
              )}
            </button>

            <Input
              value={option.text}
              disabled={saving}
              onChange={(event) =>
                updateText(
                  index,
                  event.target.value,
                )
              }
              placeholder={`Option ${letter}`}
              className="h-9"
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={
                saving || draft.length <= 2
              }
              className="h-9 w-9 shrink-0 text-destructive hover:bg-destructive/10"
              onClick={() =>
                removeOption(index)
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      })}

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={saving}
        onClick={addOption}
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add option
      </Button>

      <div className="flex justify-end gap-2">
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
          disabled={saving}
          onClick={save}
        >
          <Check className="mr-1.5 h-3.5 w-3.5" />

          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  )
}

/* ============================================================
   INLINE TAGS EDITOR
============================================================ */

function InlineTagsEditor({
  tags,
  onSave,
}: {
  tags: string[]
  onSave: (tags: string[]) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [saving, setSaving] = useState(false)

  function startEditing() {
    setDraft([...tags])
    setNewTag("")
    setEditing(true)
  }

  function cancel() {
    setDraft([...tags])
    setNewTag("")
    setEditing(false)
  }

  function removeTag(tag: string) {
    setDraft((current) =>
      current.filter((item) => item !== tag),
    )
  }

  function addTag() {
    const value = newTag.trim()

    if (!value) {
      return
    }

    if (draft.includes(value)) {
      setNewTag("")
      return
    }

    setDraft((current) => [
      ...current,
      value,
    ])

    setNewTag("")
  }

  async function save() {
    try {
      setSaving(true)

      await onSave(draft)

      setEditing(false)
    } catch {
      // Parent handles the error.
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <div className="group relative rounded-xl border border-border/60 bg-muted/20 p-4">
        {tags.length ? (
          <div className="flex flex-wrap gap-2 pr-8">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
              >
                {tag}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="pr-8 text-sm italic text-muted-foreground">
            No tags added
          </p>
        )}

        <button
          type="button"
          onClick={startEditing}
          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-md bg-background opacity-0 shadow-sm ring-1 ring-border transition-opacity group-hover:opacity-100"
          aria-label="Edit tags"
        >
          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
      {draft.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {draft.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="gap-1"
            >
              {tag}

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  removeTag(tag)
                }
                className="rounded-full p-0.5 hover:bg-foreground/10"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={newTag}
          disabled={saving}
          onChange={(event) =>
            setNewTag(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              addTag()
            }
          }}
          placeholder="Add a tag..."
          className="h-9"
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9"
          disabled={saving}
          onClick={addTag}
        >
          Add
        </Button>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={saving}
          onClick={cancel}
        >
          Cancel
        </Button>

        <Button
          type="button"
          size="sm"
          disabled={saving}
          onClick={save}
        >
          <Check className="mr-1.5 h-3.5 w-3.5" />

          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  )
}

/* ============================================================
   INLINE SOURCES EDITOR
============================================================ */

function InlineSourcesEditor({
  sources,
  onSave,
}: {
  sources: EditableSource[]
  onSave: (
    sources: EditableSource[],
  ) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<
    EditableSource[]
  >([])
  const [saving, setSaving] = useState(false)

  function cloneSources(
    sourceList: EditableSource[],
  ): EditableSource[] {
    return sourceList.map((source) => ({
      name: source.name,
      type: source.type,
      year: source.year,
    }))
  }

  function startEditing() {
    setDraft(cloneSources(sources))
    setEditing(true)
  }

  function cancel() {
    setDraft(cloneSources(sources))
    setEditing(false)
  }

  function updateSource(
    index: number,
    field: keyof EditableSource,
    value: string,
  ) {
    setDraft((current) =>
      current.map((source, i) =>
        i === index
          ? {
              ...source,
              [field]:
                field === "year"
                  ? value
                    ? Number(value)
                    : undefined
                  : value,
            }
          : source,
      ),
    )
  }

  function removeSource(index: number) {
    setDraft((current) =>
      current.filter((_, i) => i !== index),
    )
  }

  function addSource() {
    setDraft((current) => [
      ...current,
      {
        name: "",
        type: "",
        year: undefined,
      },
    ])
  }

  async function save() {
    const valid = draft.every(
      (source) =>
        source.name.trim() &&
        source.type.trim(),
    )

    if (!valid) {
      toast.error(
        "Source name and type are required",
      )
      return
    }

    try {
      setSaving(true)

      await onSave(draft)

      setEditing(false)
    } catch {
      // Parent handles the error.
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <div className="group relative">
        {sources.length ? (
          <div className="space-y-2">
            {sources.map((source, index) => (
              <div
                key={`${source.name}-${index}`}
                className="rounded-lg border border-border/50 bg-background p-3"
              >
                <p className="text-sm font-medium">
                  {source.name}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {source.type}

                  {source.year && (
                    <> • {source.year}</>
                  )}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={startEditing}
            className="flex w-full items-center justify-center rounded-lg border border-dashed border-border py-5 text-sm text-muted-foreground transition-colors hover:bg-muted/30"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add source
          </button>
        )}

        {sources.length > 0 && (
          <button
            type="button"
            onClick={startEditing}
            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-md bg-background opacity-0 shadow-sm ring-1 ring-border transition-opacity group-hover:opacity-100"
            aria-label="Edit sources"
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
      {draft.map((source, index) => (
        <div
          key={index}
          className="space-y-2 rounded-lg border border-border/60 bg-background p-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold">
              Source {index + 1}
            </p>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:bg-destructive/10"
              disabled={saving}
              onClick={() =>
                removeSource(index)
              }
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Input
            value={source.name}
            disabled={saving}
            onChange={(event) =>
              updateSource(
                index,
                "name",
                event.target.value,
              )
            }
            placeholder="Source name"
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              value={source.type}
              disabled={saving}
              onChange={(event) =>
                updateSource(
                  index,
                  "type",
                  event.target.value,
                )
              }
              placeholder="Type"
            />

            <Input
              type="number"
              value={source.year ?? ""}
              disabled={saving}
              onChange={(event) =>
                updateSource(
                  index,
                  "year",
                  event.target.value,
                )
              }
              placeholder="Year"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={saving}
        onClick={addSource}
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add source
      </Button>

      <div className="flex justify-end gap-2">
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
          disabled={saving}
          onClick={save}
        >
          <Check className="mr-1.5 h-3.5 w-3.5" />

          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  )
}

/* ============================================================
   ACADEMIC ITEM
============================================================ */

function AcademicItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="group p-4">
      <p className="mb-1 text-[10px] tracking-wider text-muted-foreground uppercase">
        {label}
      </p>

      <div className="flex items-center justify-between gap-2">
        <p
          className="truncate text-sm font-medium"
          title={value}
        >
          {value}
        </p>

        <Pencil className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </div>
  )
}

/* ============================================================
   METADATA ITEM
============================================================ */

function MetadataItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar
  label: string
  value: string
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background ring-1 ring-border">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] tracking-wider text-muted-foreground uppercase">
          {label}
        </p>

        <p className="truncate text-xs font-medium">
          {value}
        </p>
      </div>
    </div>
  )
}
