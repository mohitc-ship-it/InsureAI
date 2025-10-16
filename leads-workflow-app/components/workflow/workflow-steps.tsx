"use client"

import { cn } from "@/lib/utils"

function toSectionId(stage: string) {
  return `section-${stage.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
}

export function WorkflowSteps({
  stages,
  currentStage,
}: {
  stages: string[]
  currentStage: string
}) {
  const currentIndex = Math.max(
    0,
    stages.findIndex((s) => s.toLowerCase() === currentStage.toLowerCase()),
  )
  return (
    <div className="flex items-center gap-2 overflow-x-auto" role="tablist" aria-label="Workflow steps">
      {stages.map((stage, idx) => {
        const done = idx < currentIndex
        const active = idx === currentIndex
        return (
          <div key={stage} className="flex items-center gap-2">
            <button
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={toSectionId(stage)}
              onClick={() => {
                const el = document.getElementById(toSectionId(stage))
                el?.scrollIntoView({ behavior: "smooth", block: "start" })
              }}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs border whitespace-nowrap",
                done && "bg-primary text-primary-foreground border-primary",
                active && !done && "bg-accent text-accent-foreground border-accent",
                !done && !active && "bg-muted text-muted-foreground border-border",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              )}
            >
              {stage}
            </button>
            {idx < stages.length - 1 && <div className="h-px w-8 md:w-16 bg-border" aria-hidden />}
          </div>
        )
      })}
    </div>
  )
}
