import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold">প্রশ্নব্যাংক পাওয়া যায়নি</h1>

      <p className="text-muted-foreground">
        আপনি যে প্রশ্নব্যাংকটি খুঁজছেন, সেটি পাওয়া যায়নি।
      </p>

      <Link
        href="/question-banks"
        className="rounded-md bg-primary px-5 py-2 text-primary-foreground transition-opacity hover:opacity-90"
      >
        প্রশ্নব্যাংকে ফিরে যান
      </Link>
    </div>
  )
}
