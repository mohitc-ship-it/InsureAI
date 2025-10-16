"use client"
import { cn } from "@/lib/utils"

export function VoiceIndicator({
  active,
  className,
  label = "Listening",
}: {
  active: boolean
  className?: string
  label?: string
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative h-8 w-8" aria-hidden>
        <span className={cn("absolute inset-0 rounded-full bg-primary/80", active ? "opacity-100" : "opacity-60")} />
        <span
          className={cn("absolute inset-0 rounded-full ring-2 ring-primary", active ? "animate-ping" : "opacity-0")}
        />
      </div>
      <span className="text-sm text-muted-foreground">{active ? label : "Voice ready"}</span>
    </div>
  )
}
