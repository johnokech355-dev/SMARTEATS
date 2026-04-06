"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, BrainCircuit, User } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I'm your AI Restaurant Assistant. Ask me about revenue, orders, peak hours, or business performance.",
    timestamp: new Date(),
  },
]

const SUGGESTIONS = [
  "Give me today's summary",
  "How is revenue today?",
  "Top selling item?",
  "Peak hours?",
  "How many active orders?",
]

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // ✅ REAL BACKEND AI CALL
  async function handleSend(text?: string) {
    const msg = text || input
    if (!msg.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: msg,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    try {
      const token = localStorage.getItem("token")

      const res = await fetch("http://localhost:8080/api/ai/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: msg }),
      })

      // ⚠️ IMPORTANT FIX (no more JSON error)
      const textResponse = await res.text()

      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: textResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, response])
    } catch (err) {
      console.error(err)

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "⚠️ Failed to get AI response",
          timestamp: new Date(),
        },
      ])
    }

    setIsTyping(false)
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Ask business questions and get real-time insights from your system.
        </p>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="shrink-0 border-b border-border pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <BrainCircuit className="h-4 w-4 text-primary-foreground" />
            </div>
            RestaurantAI Assistant
            <Badge variant="secondary" className="text-[10px]">
              Live
            </Badge>
          </CardTitle>
        </CardHeader>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    msg.role === "assistant"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <BrainCircuit className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>

                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.role === "assistant"
                      ? "bg-secondary/50 text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {msg.content}
                  </p>

                  <p
                    className={`mt-1 text-[10px] ${
                      msg.role === "assistant"
                        ? "text-muted-foreground"
                        : "text-primary-foreground/70"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <BrainCircuit className="h-4 w-4" />
                </div>
                <div className="rounded-2xl bg-secondary/50 px-4 py-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-150" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-300" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="shrink-0 border-t border-border px-4 py-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Suggested questions
            </p>

            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-secondary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="shrink-0 border-t border-border p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <Input
              placeholder="Ask about your restaurant..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
              disabled={isTyping}
            />

            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}