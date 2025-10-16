export type LeadStatus =
  | "submitted"
  | "submitted but requires additional info"
  | "form filling stage"
  | "submitted quote"
  | "submitted-declined"
  | "submitted-bound"

export type OpportunityStage =
  | "Lead Intake"
  | "Information Gathering"
  | "Carrier Selection"
  | "Form Completion"
  | "Submission"
  | "Quote/Bind"
  | "Policy Issued"

export type CarrierOption = {
  name: string
  logo?: string
  fit_score: number // 0-100
  requirements: string[] // requirements/forms needed
  reason: string // AI reason for selection
  selected?: boolean
}

export type FormItem = {
  id: string
  name: string
  status: "pending" | "ai-filled" | "uploaded" | "completed"
  ai_confidence?: number // 0-100
  download_url?: string
}

export type SupportingDoc = {
  id: string
  name: string
  uploaded: boolean
}

export type SubmissionInfo = {
  status: "pending" | "ready" | "submitted"
  submission_id?: string
  timestamp?: string
}

export type QuoteItem = {
  carrier: string
  premium: number
  deductible: number
  effective_date: string
  selected?: boolean
}

export type PolicyInfo = {
  id?: string
  effective_date?: string
  expiry_date?: string
  url?: string
  number:string
  issued_at:string
}

export type Lead = {
  id: string
  client_name: string
  state: string
  quote_or_inquiry: "quote" | "inquiry"
  status: LeadStatus
  assigned_underwriter: string
  needby_date: string
  effective_date: string
  last_updated: string
  carrier: string
  agent: string
  community: string
  stage: "Lead Created" | "Submission Sent" | "Quote Received" | "Bound" | "Policy Issued"
  missing_items?: string[]
  opportunity_id?: string
  detailed_stage?: OpportunityStage
  client_email?: string
  client_phone?: string
  property?: {
    address?: string
    sq_ft?: number
    construction_type?: string
    year_built?: number
  }
  coverage_requested?: string[]
  missing_fields?: string[]
  carrier_options?: CarrierOption[]
  forms?: FormItem[]
  supporting_docs?: SupportingDoc[]
  submission?: SubmissionInfo
  quotes?: QuoteItem[]
  policy?: PolicyInfo
}
