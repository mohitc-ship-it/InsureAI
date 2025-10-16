import { formatDistanceToNow, parseISO } from "date-fns"

export type Activity = {
  id: string
  type: "new-lead" | "update"
  description: string
  created_at: string
}

export function ActivityFeed({ items }: { items: Activity[] }) {
  return (
    <ul className="space-y-2">
      {items.map((a) => (
        <li key={a.id} className="rounded-lg border p-3">
          <div className="text-sm">
            <span className="font-medium">{labelForType(a.type)}</span>{" "}
            <span className="text-muted-foreground">— {a.description}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(parseISO(a.created_at), { addSuffix: true })}
          </div>
        </li>
      ))}
      {items.length === 0 && <li className="text-sm text-muted-foreground">No recent activity.</li>}
    </ul>
  )
}

function labelForType(t: Activity["type"]) {
  return t === "new-lead" ? "New Lead" : "Update"
}
