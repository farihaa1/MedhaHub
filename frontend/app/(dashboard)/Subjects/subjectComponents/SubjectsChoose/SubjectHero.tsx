export default function SubjectHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl mb-2 font-bold">বিষয়সমূহ</h2>

        <p className="text-[11px] text-muted-foreground max-w-xs">
          আপনার পছন্দের বিষয় নির্বাচন করে অধ্যায়ভিত্তিক প্রস্তুতি শুরু করুন।
        </p>
      </div>

      <button className="rounded-full bg-emerald-600/40 px-4 py-2 text-emerald-400 transition hover:bg-emerald-500/30 text-[9px] md:text-[11px]">
        অগ্রগতি দেখুন →
      </button>
    </div>
  )
}
