"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import type { CarrierOption } from "@/lib/types"

export function CarrierSelectionPanel({
  options,
  onSelectionChange,
}: {
  options: CarrierOption[]
  onSelectionChange?: (selected: CarrierOption[]) => void
}) {
  const [items, setItems] = useState<CarrierOption[]>(options || [])

  const selected = useMemo(() => items.filter((o) => o.selected), [items])

  return (
    <Card id="section-carrier-selection">
      <CardHeader className="pb-3">
        <CardTitle>Carrier Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Carrier</TableHead>
              <TableHead>AI Fit</TableHead>
              <TableHead>Requirements</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Select</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((c, idx) => (
              <TableRow key={c.name}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>
                  <Badge variant={c.fit_score >= 85 ? "default" : "secondary"}>{c.fit_score}%</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.requirements.join(", ")}</TableCell>
                <TableCell className="text-sm">{c.reason}</TableCell>
                <TableCell className="text-right">
                  <Switch
                    checked={!!c.selected}
                    onCheckedChange={(v) => {
                      const next = items.slice()
                      next[idx] = { ...c, selected: v }
                      setItems(next)
                      onSelectionChange?.(next.filter((x) => x.selected))
                    }}
                    aria-label={`Select ${c.name}`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selected.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Selected: {selected.map((s) => s.name).join(", ")} — required forms will update accordingly.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
