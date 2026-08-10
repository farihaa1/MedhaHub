import Link from "next/link"

export default function SubjectHeader() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          বিষয়সমূহ
        </h1>

        <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
          আপনার পছন্দের বিষয় নির্বাচন করে অধ্যায়ভিত্তিক প্রস্তুতি শুরু করুন।
        </p>
      </div>

      <Link
        href="/progress"
        className="shrink-0 rounded-lg border border-border bg-background px-3 py-2 text-[11px] font-medium text-foreground transition-colors hover:bg-muted"
      >
        অগ্রগতি দেখুন →
      </Link>
    </div>
  )
}
