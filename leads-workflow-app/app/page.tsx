"use client"

import Link from "next/link"
import { Suspense, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ActivityFeed,Activity } from "@/components/dashboard/activity-feed"
import { RecentlyViewed } from "@/components/dashboard/recently-viewed"
import { LeadsTable } from "@/components/dashboard/leads-table"
import { FiltersBar } from "@/components/dashboard/filters-bar"
import { ChatbotWidget } from "@/components/chat/chatbot-widget"
import { leadsData, activities, recentlyViewedItems, carriers, agents, communities, stages } from "@/lib/data"

export default function Page() {
  // local filter state
  const [search, setSearch] = useState("")
  const [carrier, setCarrier] = useState<string>("all")
  const [agent, setAgent] = useState<string>("all")
  const [community, setCommunity] = useState<string>("all")
  const [stage, setStage] = useState<string>("all")
  const [stateFilter, setStateFilter] = useState<string>("all")

  const filteredLeads = useMemo(() => {
    return leadsData.filter((l) => {
      const matchesSearch = search.trim().length === 0 || l.client_name.toLowerCase().includes(search.toLowerCase())

      const matchesCarrier = carrier === "all" || l.carrier === carrier
      const matchesAgent = agent === "all" || l.agent === agent
      const matchesCommunity = community === "all" || l.community === community
      const matchesStage = stage === "all" || l.stage === stage
      const matchesState = stateFilter === "all" || l.state === stateFilter

      return matchesSearch && matchesCarrier && matchesAgent && matchesCommunity && matchesStage && matchesState
    })
  }, [search, carrier, agent, community, stage, stateFilter])

  return (
    <main className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-semibold text-pretty">Leads & Clients Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="default">
            <Link href="/clients/new">New Lead</Link>
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-balance">Active Leads</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FiltersBar
            search={search}
            onSearchChange={setSearch}
            carriers={["all", ...carriers]}
            carrier={carrier}
            onCarrierChange={setCarrier}
            agents={["all", ...agents]}
            agent={agent}
            onAgentChange={setAgent}
            communities={["all", ...communities]}
            community={community}
            onCommunityChange={setCommunity}
            stages={["all", ...stages]}
            stage={stage}
            onStageChange={setStage}
            states={["all", ...Array.from(new Set(leadsData.map((l) => l.state)))]}
            stateFilter={stateFilter}
            onStateFilterChange={setStateFilter}
          />
          <Suspense fallback={<div className="text-muted-foreground">Loading table…</div>}>
            <LeadsTable leads={filteredLeads} />
          </Suspense>
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-balance">Recently Viewed</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentlyViewed items={recentlyViewedItems} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-balance">Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={activities as Activity[]} />
          </CardContent>
        </Card>
      </section>

      <ChatbotWidget />
    </main>
  )
}
