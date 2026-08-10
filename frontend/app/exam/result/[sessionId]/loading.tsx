export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h2 className="mt-5 text-base font-semibold">Preparing your results</h2>

        <p className="mt-2 text-xs text-muted-foreground">
          Calculating your examination performance...
        </p>

        <div className="mx-auto mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    </div>
  )
}
