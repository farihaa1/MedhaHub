import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Question Bank Not Found</h1>

      <p className="text-muted-foreground">
        The requested question bank does not exist.
      </p>

      <Link
        href="/question-banks"
        className="rounded-md bg-primary px-5 py-2 text-primary-foreground"
      >
        Back to Question Banks
      </Link>
    </div>
  )
}
