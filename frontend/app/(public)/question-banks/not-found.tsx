import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-100 flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-5xl font-bold">404</h1>

      <h2 className="text-xl font-semibold">প্রশ্ন ব্যাংকটি পাওয়া যায়নি</h2>

      <p className="text-sm text-muted-foreground">
        আপনি যে প্রশ্ন ব্যাংকটি খুঁজছেন, সেটি পাওয়া যায়নি।
      </p>

      <Link
        href="/question-banks"
        className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        প্রশ্ন ব্যাংকে ফিরে যান
      </Link>
    </div>
  )
}
