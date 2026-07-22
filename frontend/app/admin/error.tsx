"use client"

import { AlertTriangle, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Props {
  error: Error & {
    digest?: string
  }
  reset: () => void
}

export default function Error({ error, reset }: Props) {
  console.error(error)

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>

          <CardTitle>Something went wrong</CardTitle>

          <CardDescription>
            We couldn&apos;t load the dashboard. Please try again.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center">
          <Button onClick={reset}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
