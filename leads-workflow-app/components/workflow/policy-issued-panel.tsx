"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PolicyInfo } from "@/lib/types"
import { Button } from "@/components/ui/button"

export function PolicyIssuedPanel({ policy }: { policy?: PolicyInfo }) {
  return (
    <Card id="section-policy-issued">
      <CardHeader className="pb-3">
        <CardTitle>Policy Issued</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {policy?.id ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-lg border p-3">
                <div className="text-sm text-muted-foreground">Policy ID</div>
                <div className="font-medium">{policy.id}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm text-muted-foreground">Effective</div>
                <div className="font-medium">
                  {policy.effective_date && new Date(policy.effective_date).toLocaleDateString()}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm text-muted-foreground">Expiry</div>
                <div className="font-medium">
                  {policy.expiry_date && new Date(policy.expiry_date).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div>
              <Button asChild variant="secondary">
                <a href={policy.url || "#"} target="_blank" rel="noreferrer">
                  Download Policy
                </a>
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Renewal reminders will be sent automatically ahead of expiry.
            </div>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">No issued policy yet.</div>
        )}
      </CardContent>
    </Card>
  )
}
