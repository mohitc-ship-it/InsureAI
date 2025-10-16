import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WorkflowSteps } from "@/components/workflow/workflow-steps"
import { ChatbotWidget } from "@/components/chat/chatbot-widget"
import { leadsData } from "@/lib/data"
import { format, parseISO, differenceInCalendarDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { detailedStages } from "@/lib/data"
import { ClientInfoPanel } from "@/components/workflow/client-info-panel"
import { CarrierSelectionPanel } from "@/components/workflow/carrier-selection"
import { FormsPanel } from "@/components/workflow/forms-panel"
import { SubmissionPanel } from "@/components/workflow/submission-panel"
import { QuotesBindPanel } from "@/components/workflow/quotes-bind-panel"
import { PolicyIssuedPanel } from "@/components/workflow/policy-issued-panel"

export default async function ClientPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const lead = leadsData.find((l) => l.id === id)
  if (!lead) return notFound()

  const needByDays = differenceInCalendarDays(parseISO(lead.needby_date), new Date())
  const isUrgent = needByDays <= 2
  const hasMissing = lead.missing_items && lead.missing_items.length > 0

  return (
    <main className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-pretty">{lead.client_name}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>
            Opportunity ID: <span className="text-foreground">{lead.opportunity_id || "—"}</span>
          </span>
          <span className="hidden md:inline">•</span>
          <span>
            Assigned Agent: <span className="text-foreground">{lead.agent}</span>
          </span>
          <span className="hidden md:inline">•</span>
          <span>
            Current Stage: <Badge>{lead.detailed_stage || "Lead Intake"}</Badge>
          </span>
          <span className="hidden md:inline">•</span>
          <span>Last Updated: {format(parseISO(lead.last_updated), "PP p")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary">
            Send Reminder
          </Button>
          <Button size="sm" variant="outline">
            Add Note / Voice
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Workflow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <WorkflowSteps currentStage={lead.detailed_stage || "Lead Intake"} stages={detailedStages} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <div className="text-sm text-muted-foreground">Need By</div>
              <div className="font-medium">{format(parseISO(lead.needby_date), "PP")}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-sm text-muted-foreground">Effective Date</div>
              <div className="font-medium">{format(parseISO(lead.effective_date), "PP")}</div>
            </div>
          </div>

          {(isUrgent || hasMissing) && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
              <div className="font-medium text-destructive-foreground">Alerts</div>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {isUrgent && <li>Need-by date is approaching in {Math.max(needByDays, 0)} day(s).</li>}
                {hasMissing && <li>Missing items: {lead.missing_items?.join(", ")}</li>}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 1) Client & Property Info */}
      <ClientInfoPanel lead={lead} />

      {/* 2) Information Gathering panel could be combined with Client Info in UI (retains scroll anchor) */}
      <div id="section-information-gathering" className="sr-only" aria-hidden />

      {/* 3) Carrier Selection */}
      <CarrierSelectionPanel options={lead.carrier_options || []} />

      {/* 4) Form Completion */}
      <FormsPanel forms={lead.forms || []} docs={lead.supporting_docs || []} />

      {/* 5) Submission */}
      <SubmissionPanel forms={lead.forms || []} submission={lead.submission} />

      {/* 6) Quote/Bind */}
      <QuotesBindPanel quotes={lead.quotes} />

      {/* 7) Policy Issued */}
      <PolicyIssuedPanel policy={lead.policy} />

      <ChatbotWidget />
    </main>
  )
}
