"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import type { FormItem, SubmissionInfo } from "@/lib/types"
import { useMemo } from "react"

export function SubmissionPanel({
  forms,
  submission,
}: {
  forms: FormItem[]
  submission?: SubmissionInfo
}) {
  const ready = useMemo(() => forms.every((f) => f.status === "uploaded" || f.status === "completed"), [forms])
  const statusText = submission?.status || (ready ? "ready" : "pending")

  return (
    <Card id="section-submission">
      <CardHeader className="pb-3">
        <CardTitle>Submission</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {forms.map((f) => (
            <label key={f.id} className="flex items-center gap-2 text-sm">
              <Checkbox checked={f.status === "uploaded" || f.status === "completed"} disabled />
              <span>{f.name}</span>
            </label>
          ))}
        </div>
        <div className="text-sm">
          Status: <span className="font-medium capitalize">{statusText}</span>
        </div>
        <Button disabled={!ready}>Submit to Carrier</Button>
        <div className="text-xs text-muted-foreground">
          AI validates forms before enabling submission and records submission ID & timestamp.
        </div>
      </CardContent>
    </Card>
  )
}
