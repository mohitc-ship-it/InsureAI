"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { VoiceIndicator } from "@/components/shared/voice-indicator"

export function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), [])
  const { messages, sendMessage, status } = useChat({ transport })

  // voice support
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<any | null>(null)
  const [speakReplies, setSpeakReplies] = useState(true)
  const lastSpokenIdRef = useRef<string | null>(null)

  const voiceSupported =
    typeof window !== "undefined" &&
    // @ts-ignore
    (window.SpeechRecognition || window.webkitSpeechRecognition) &&
    typeof window.speechSynthesis !== "undefined"

  useEffect(() => {
    if (!voiceEnabled || !voiceSupported) return

    // @ts-ignore
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.lang = "en-US"
    rec.interimResults = false
    rec.continuous = false

    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join(" ")
      if (transcript?.trim()) {
        sendMessage({ text: transcript.trim() })
      }
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)

    recognitionRef.current = rec
    return () => {
      try {
        rec.onresult = null
        rec.onend = null
        rec.onerror = null
        if (listening) rec.stop()
      } catch {}
      recognitionRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceEnabled, voiceSupported])

  const startListening = () => {
    if (!voiceSupported || !recognitionRef.current) return
    try {
      setListening(true)
      recognitionRef.current.start()
    } catch {
      setListening(false)
    }
  }

  const stopListening = () => {
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.stop()
    } catch {}
    setListening(false)
  }

  // Speak assistant replies when enabled, once per message
  useEffect(() => {
    if (!voiceEnabled || !speakReplies || !voiceSupported) return
    if (status === "in_progress") return
    const last = [...messages].reverse().find((m) => m.role === "assistant")
    if (!last || last.id === lastSpokenIdRef.current) return

    const text = last.parts
      .map((p) => (p.type === "text" ? p.text : ""))
      .join(" ")
      .trim()
    if (!text) return

    try {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = "en-US"
      window.speechSynthesis.speak(u)
      lastSpokenIdRef.current = last.id
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, status, voiceEnabled, speakReplies, voiceSupported])

  return (
    <>
      <button
        aria-label="Open chatbot"
        onClick={() => setOpen((v) => !v)}
        className="fixed left-4 bottom-4 z-40 rounded-full bg-primary text-primary-foreground w-12 h-12 shadow-lg"
      >
        {/* simple dot icon */}
        <span className="block w-2 h-2 bg-primary-foreground rounded-full mx-auto" />
      </button>

      <div
        className={cn(
          "fixed z-40 bottom-20 left-4 right-4 md:left-4 md:right-auto md:w-[30vw] max-w-[480px] rounded-lg border bg-card shadow-2xl overflow-hidden transition-all",
          open ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4",
        )}
        role="dialog"
        aria-modal="false"
        aria-label="AI Assistant"
      >
        <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
          <div className="text-sm font-medium">Assistant</div>
          <div className="flex items-center gap-2">
            {/* Voice toggle */}
            <Button
              size="sm"
              variant={voiceEnabled ? "default" : "outline"}
              onClick={() => setVoiceEnabled((v) => !v)}
              disabled={!voiceSupported}
              aria-pressed={voiceEnabled}
              title={voiceSupported ? "Toggle voice mode" : "Voice not supported in this browser"}
            >
              {voiceEnabled ? "Voice On" : "Voice Off"}
            </Button>
            {/* Speak Replies toggle */}
            <Button
              size="sm"
              variant={speakReplies ? "default" : "outline"}
              onClick={() => setSpeakReplies((v) => !v)}
              disabled={!voiceSupported}
              aria-pressed={speakReplies}
              title="Speak assistant replies"
            >
              {speakReplies ? "Speak: On" : "Speak: Off"}
            </Button>
            {/* Close */}
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>

        <div className="h-64 md:h-80 overflow-y-auto p-3 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={cn("text-sm", m.role === "user" ? "text-foreground" : "text-muted-foreground")}>
              <span className="font-medium">{m.role === "user" ? "You" : "Assistant"}: </span>
              {m.parts.map((p, i) => (p.type === "text" ? <span key={i}>{p.text}</span> : null))}
            </div>
          ))}
          {status === "in_progress" && <div className="text-xs text-muted-foreground">Thinking…</div>}
        </div>

        <form
          className="flex flex-col gap-2 p-3 border-t"
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.currentTarget as HTMLFormElement
            const input = form.elements.namedItem("message") as HTMLInputElement
            if (input.value.trim().length === 0) return
            sendMessage({ text: input.value })
            input.value = ""
          }}
        >
          {/* Voice status row */}
          {voiceEnabled && (
            <div className="flex items-center justify-between">
              <VoiceIndicator active={listening} label={listening ? "Listening…" : "Voice ready"} />
              <div className="flex items-center gap-2">
                {!listening ? (
                  <Button type="button" variant="secondary" onClick={startListening} disabled={!voiceSupported}>
                    Start Mic
                  </Button>
                ) : (
                  <Button type="button" variant="destructive" onClick={stopListening}>
                    Stop
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Input name="message" placeholder="Ask about a lead…" className="flex-1" />
            <Button type="submit" disabled={status === "in_progress"}>
              Send
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
