"use client"

export default function Error({
  reset,
}: {
  reset: () => void
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h2>Failed to load exam.</h2>

      <button
        onClick={reset}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Try Again
      </button>
    </div>
  )
}