"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { QuoteItem } from "@/lib/types"

export function QuotesBindPanel({ quotes }: { quotes?: QuoteItem[] }) {
  if (!quotes || quotes.length === 0) {
    return (
      <Card id="section-quote-bind">
        <CardHeader className="pb-3">
          <CardTitle>Quotes & Bind</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No quotes yet. AI will extract quote details from emails/API.
        </CardContent>
      </Card>
    )
  }
  return (
    <Card id="section-quote-bind">
      <CardHeader className="pb-3">
        <CardTitle>Quotes & Bind</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Carrier</TableHead>
              <TableHead>Premium</TableHead>
              <TableHead>Deductible</TableHead>
              <TableHead>Effective</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((q) => (
              <TableRow key={`${q.carrier}-${q.effective_date}`}>
                <TableCell className="font-medium">{q.carrier}</TableCell>
                <TableCell>${q.premium.toLocaleString()}</TableCell>
                <TableCell>${q.deductible.toLocaleString()}</TableCell>
                <TableCell>{new Date(q.effective_date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant={q.selected ? "default" : "secondary"}>
                    {q.selected ? "Selected" : "Select"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="text-xs text-muted-foreground">
          Binding the selected quote will advance the workflow to Policy Issued.
        </div>
      </CardContent>
    </Card>
  )
}
