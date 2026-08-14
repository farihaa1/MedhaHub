"use client"

interface ErrorProps {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-2xl font-bold">ক্যাটাগরি লোড করতে সমস্যা হয়েছে</h2>

      <p className="text-muted-foreground">{error.message}</p>

      <button
        onClick={reset}
        className="rounded-md bg-primary px-5 py-2 text-primary-foreground transition-opacity hover:opacity-90"
      >
        আবার চেষ্টা করুন
      </button>
    </div>
  )
}
