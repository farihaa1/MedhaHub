export default function Loading() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-5">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-semibold">Loading...</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Please wait a moment.
          </p>
        </div>
      </div>
    </main>
  )
}
