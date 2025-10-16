"use client"

import Link from "next/link"
import type { Lead } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"

export function LeadsTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="min-w-full text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
            <th>Client</th>
            <th>State</th>
            <th>Quote/Inquiry</th>
            <th>Status</th>
            <th>Assigned Underwriter</th>
            <th>Need By</th>
            <th>Effective</th>
            <th>Last Updated</th>
            <th className="w-16">Open</th>
          </tr>
        </thead>
        <tbody className="[&>tr]:border-t">
          {leads.map((l) => (
            <tr key={l.id} className="[&>td]:px-3 [&>td]:py-2">
              <td className="font-medium">{l.client_name}</td>
              <td>{l.state}</td>
              <td>{l.quote_or_inquiry}</td>
              <td>
                <Badge variant={variantForStatus(l.status)}>{l.status}</Badge>
              </td>
              <td>{l.assigned_underwriter}</td>
              <td>{format(parseISO(l.needby_date), "PP")}</td>
              <td>{format(parseISO(l.effective_date), "PP")}</td>
              <td>{format(parseISO(l.last_updated), "PP p")}</td>
              <td>
                <Link className="text-primary underline underline-offset-2" href={`/clients/${l.id}`}>
                  View
                </Link>
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr>
              <td colSpan={9} className="p-4 text-center text-muted-foreground">
                No leads match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function variantForStatus(status: string): "default" | "secondary" | "outline" {
  switch (status.toLowerCase()) {
    case "submitted":
    case "submitted quote":
      return "default"
    case "form filling stage":
      return "secondary"
    default:
      return "outline"
  }
}
