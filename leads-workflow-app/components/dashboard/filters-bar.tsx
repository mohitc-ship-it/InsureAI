"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
  search: string
  onSearchChange: (v: string) => void
  carriers: string[]
  carrier: string
  onCarrierChange: (v: string) => void
  agents: string[]
  agent: string
  onAgentChange: (v: string) => void
  communities: string[]
  community: string
  onCommunityChange: (v: string) => void
  stages: string[]
  stage: string
  onStageChange: (v: string) => void
  states: string[]
  stateFilter: string
  onStateFilterChange: (v: string) => void
}

export function FiltersBar(props: Props) {
  const {
    search,
    onSearchChange,
    carriers,
    carrier,
    onCarrierChange,
    agents,
    agent,
    onAgentChange,
    communities,
    community,
    onCommunityChange,
    stages,
    stage,
    onStageChange,
    states,
    stateFilter,
    onStateFilterChange,
  } = props

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
      <Input
        placeholder="Search client"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="lg:col-span-2"
      />

      <Select value={carrier} onValueChange={onCarrierChange}>
        <SelectTrigger>
          <SelectValue placeholder="Carrier" />
        </SelectTrigger>
        <SelectContent>
          {carriers.map((c) => (
            <SelectItem key={c} value={c}>
              {c === "all" ? "All carriers" : c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={agent} onValueChange={onAgentChange}>
        <SelectTrigger>
          <SelectValue placeholder="Agent" />
        </SelectTrigger>
        <SelectContent>
          {agents.map((a) => (
            <SelectItem key={a} value={a}>
              {a === "all" ? "All agents" : a}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={community} onValueChange={onCommunityChange}>
        <SelectTrigger>
          <SelectValue placeholder="Community" />
        </SelectTrigger>
        <SelectContent>
          {communities.map((c) => (
            <SelectItem key={c} value={c}>
              {c === "all" ? "All communities" : c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={stage} onValueChange={onStageChange}>
        <SelectTrigger>
          <SelectValue placeholder="Stage" />
        </SelectTrigger>
        <SelectContent>
          {stages.map((s) => (
            <SelectItem key={s} value={s}>
              {s === "all" ? "All stages" : s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={stateFilter} onValueChange={onStateFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="State" />
        </SelectTrigger>
        <SelectContent>
          {states.map((s) => (
            <SelectItem key={s} value={s}>
              {s === "all" ? "All states" : s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
