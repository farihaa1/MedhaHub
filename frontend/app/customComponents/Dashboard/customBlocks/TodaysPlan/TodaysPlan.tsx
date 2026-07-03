"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import PlanItem from "./PlanItem"
import { todaysPlan } from "./planData"

export default function TodaysPlan() {
  const [plans, setPlans] = useState(todaysPlan)

  const togglePlan = (id: number) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === id
          ? {
              ...plan,
              done: !plan.done,
            }
          : plan
      )
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>আজকের পরিকল্পনা</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {plans.map((plan) => (
          <PlanItem
            key={plan.id}
            {...plan}
            onToggle={() => togglePlan(plan.id)}
          />
        ))}

        <Button variant="outline" className="w-full">
          পরিকল্পনা সম্পাদনা করুন
          <Pencil className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
