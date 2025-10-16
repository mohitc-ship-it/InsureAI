"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Lead } from "@/lib/types"
import { cn } from "@/lib/utils"

export function ClientInfoPanel({ lead }: { lead: Lead }) {
  const missing = new Set(lead.missing_fields || [])
  return (
    <Card id="section-lead-intake">
      <CardHeader className="pb-3">
        <CardTitle>Client & Property Info</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Client Name</Label>
          <Input defaultValue={lead.client_name} />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input defaultValue={lead.client_email} type="email" />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input defaultValue={lead.client_phone} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Address</Label>
          <Input defaultValue={lead.property?.address} className={cn(missing.has("Address") && "bg-yellow-100/50")} />
        </div>
        <div className="space-y-2">
          <Label>Square Feet</Label>
          <Input defaultValue={lead.property?.sq_ft} className={cn(missing.has("Sq Ft") && "bg-yellow-100/50")} />
        </div>
        <div className="space-y-2">
          <Label>Construction Type</Label>
          <Input
            defaultValue={lead.property?.construction_type}
            className={cn(missing.has("Construction Type") && "bg-yellow-100/50")}
          />
        </div>
        <div className="space-y-2">
          <Label>Year Built</Label>
          <Input
            defaultValue={lead.property?.year_built}
            className={cn(missing.has("Year Built") && "bg-yellow-100/50")}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Coverage Requested</Label>
          <Input defaultValue={(lead.coverage_requested || []).join(", ")} />
        </div>
        <p className="text-xs text-muted-foreground md:col-span-2">
          Fields highlighted in yellow need confirmation or are missing.
        </p>
      </CardContent>
    </Card>
  )
}
