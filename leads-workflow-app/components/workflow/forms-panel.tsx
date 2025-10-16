"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { VoiceIndicator } from "@/components/shared/voice-indicator"
import type { FormItem, SupportingDoc } from "@/lib/types"
import { DefaultChatTransport } from "ai"
import { useChat } from "@ai-sdk/react"

function FormStatusBadge({ status }: { status: FormItem["status"] }) {
  const map: Record<FormItem["status"], { label: string; variant: "default" | "secondary" | "outline" }> = {
    pending: { label: "Pending", variant: "outline" },
    "ai-filled": { label: "AI Filled", variant: "secondary" },
    uploaded: { label: "Uploaded", variant: "default" },
    completed: { label: "Completed", variant: "default" },
  }
  const it = map[status]
  return <Badge variant={it.variant}>{it.label}</Badge>
}

export function FormsPanel({
  forms,
  docs,
}: {
  forms: FormItem[]
  docs: SupportingDoc[]
}) {
  const [selected, setSelected] = useState<FormItem | null>(forms?.[0] || null)
  const [mode, setMode] = useState<"chat" | "voice">("chat")
  const [voiceActive, setVoiceActive] = useState(false)
  const recognitionRef = useRef<any>(null)
  const lastAssistantTextRef = useRef<string>("")

  const completedCount = useMemo(
    () => forms.filter((f) => f.status === "uploaded" || f.status === "completed").length,
    [forms],
  )
  const progress = Math.round((completedCount / Math.max(forms.length, 1)) * 100)

  // Inline assistant for forms
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), [])
  const { messages, sendMessage, status } = useChat({ transport })

  useEffect(() => {
    if (mode !== "voice") {
      setVoiceActive(false)
      return
    }
    if (!voiceActive) {
      if (recognitionRef.current) recognitionRef.current.stop?.()
      return
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceActive(false)
      return
    }
    const rec = new SpeechRecognition()
    rec.lang = "en-US"
    rec.continuous = true
    rec.interimResults = false
    rec.onresult = (e: any) => {
      const last = e.results[e.results.length - 1]
      const text = last[0].transcript
      sendMessage({ text })
    }
    rec.onerror = () => setVoiceActive(false)
    recognitionRef.current = rec
    rec.start()
    return () => rec.stop()
  }, [mode, voiceActive, sendMessage])

  useEffect(() => {
    if (mode !== "voice") return
    const synth: SpeechSynthesis | undefined = typeof window !== "undefined" ? window.speechSynthesis : undefined
    if (!synth) return
    const last = [...messages].reverse().find((m) => m.role === "assistant")
    const text = last?.parts
      ?.map((p) => (p.type === "text" ? p.text : ""))
      .join(" ")
      .trim()
    if (!text || text === lastAssistantTextRef.current) return
    lastAssistantTextRef.current = text
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = 1.0
    utter.pitch = 1.0
    utter.lang = "en-US"
    synth.cancel()
    synth.speak(utter)
  }, [messages, mode])

  return (
    <Card id="section-form-completion">
      <CardHeader className="pb-3">
        <CardTitle>Form Completion</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Progress: {completedCount}/{forms.length} completed
            </div>
            <div className="w-40">
              <Progress value={progress} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {forms.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelected(f)}
                className="text-left rounded-lg border p-3 hover:bg-muted/40 focus:outline-none focus-visible:ring-2"
                aria-controls="form-detail"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{f.name}</div>
                  <FormStatusBadge status={f.status} />
                </div>
                {typeof f.ai_confidence === "number" && f.ai_confidence > 0 && (
                  <div className="mt-1 text-xs text-muted-foreground">AI confidence: {f.ai_confidence}%</div>
                )}
              </button>
            ))}
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Supporting Documents</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {docs.map((d) => (
                <div key={d.id} className="rounded-lg border p-3 flex items-center justify-between">
                  <div className="text-sm">{d.name}</div>
                  <Badge variant={d.uploaded ? "default" : "outline"}>{d.uploaded ? "Uploaded" : "Missing"}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="form-detail" className="lg:col-span-1 space-y-3">
          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">{selected?.name || "Select a form"}</div>
              {selected?.download_url && (
                <Button asChild size="sm" variant="secondary">
                  <a href={selected.download_url} target="_blank" rel="noreferrer">
                    Download PDF
                  </a>
                </Button>
              )}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              AI-filled fields are highlighted. Upload a completed PDF to mark this form as done.
            </div>
            <div className="mt-3">
              <Input type="file" aria-label="Upload completed form" />
            </div>
          </div>

          <div className="rounded-lg border p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Form Assistant</div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={mode === "chat" ? "default" : "secondary"}
                  onClick={() => setMode("chat")}
                  aria-pressed={mode === "chat"}
                >
                  Chat
                </Button>
                <Button
                  size="sm"
                  variant={mode === "voice" ? "default" : "secondary"}
                  onClick={() => setMode("voice")}
                  aria-pressed={mode === "voice"}
                >
                  Voice
                </Button>
              </div>
            </div>

            {mode === "voice" && (
              <div className="flex items-center justify-between">
                <VoiceIndicator active={voiceActive} />
                <Button
                  size="sm"
                  variant={voiceActive ? "default" : "secondary"}
                  onClick={() => setVoiceActive((v) => !v)}
                >
                  {voiceActive ? "Stop Listening" : "Start Listening"}
                </Button>
              </div>
            )}

            <div className="h-32 overflow-y-auto border rounded p-2 bg-muted/30">
              {messages.length === 0 && (
                <div className="text-xs text-muted-foreground">
                  {mode === "voice"
                    ? "Enable the mic to ask questions by voice…"
                    : "Ask AI to help fill tricky fields…"}
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className="text-xs mb-1">
                  <span className="font-medium">{m.role === "user" ? "You" : "Assistant"}: </span>
                  {m.parts.map((p, i) => (p.type === "text" ? <span key={i}>{p.text}</span> : null))}
                </div>
              ))}
              {status === "streaming" && <div className="text-xs text-muted-foreground">Thinking…</div>}
            </div>

            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                const input = e.currentTarget.elements.namedItem("q") as HTMLInputElement
                if (!input.value.trim()) return
                sendMessage({ text: input.value })
                input.value = ""
              }}
            >
              <Input name="q" placeholder="e.g., What’s the correct NAICS?" aria-label="Ask the assistant" />
              <Button type="submit" size="sm" disabled={status === "streaming"}>
                Ask
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
