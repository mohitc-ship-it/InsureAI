"use client"

import Link from "next/link"
import { formatDistanceToNow, parseISO } from "date-fns"

type Item = {
  id: string
  client_name: string
  viewed_at: string
}

export function RecentlyViewed({ items }: { items: Item[] }) {
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <li key={i.id} className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <Link href={`/clients/${i.id}`} className="font-medium text-primary underline-offset-4 hover:underline">
              {i.client_name}
            </Link>
            <div className="text-xs text-muted-foreground">
              Viewed {formatDistanceToNow(parseISO(i.viewed_at), { addSuffix: true })}
            </div>
          </div>
          <Link href={`/clients/${i.id}`} className="text-sm text-primary underline underline-offset-2">
            Open
          </Link>
        </li>
      ))}
      {items.length === 0 && <li className="text-sm text-muted-foreground">No recent items.</li>}
    </ul>
  )
}
