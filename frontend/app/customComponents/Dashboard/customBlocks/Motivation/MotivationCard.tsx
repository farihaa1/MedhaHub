"use client"

import { useMemo } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Quote } from "lucide-react"

import { quotes } from "./quoteData"

export default function MotivationCard() {
  const quote = useMemo(() => {
    const day = new Date().getDate()
    return quotes[day % quotes.length]
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Quote className="h-5 w-5 text-primary" />
          প্রেরণার বাণী
        </CardTitle>

        <CardDescription>আজকের অনুপ্রেরণা</CardDescription>
      </CardHeader>

      <CardContent>
        <blockquote className="border-l-4 border-primary pl-4 text-muted-foreground italic">
          “{quote.text}”
        </blockquote>

        <p className="mt-4 text-right text-sm font-medium">— {quote.author}</p>
      </CardContent>
    </Card>
  )
}
