"use client";

import { useState } from "react";
import { Button, Card, EmptyState, Input, Search } from "@ac/ui";
import { Sparkles } from "lucide-react";

type Msg = { id: string; role: "user" | "assistant"; text: string };

const SEED: Msg[] = [
  {
    id: "1",
    role: "assistant",
    text: "Hi, I am Giulia. Ask me about documents, approvals, or search your archive.",
  },
];

const SUGGESTIONS = [
  "Show invoices over €5k pending review",
  "Summarize Contract-Renewal-Q3",
  "List documents tagged rgpd",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [input, setInput] = useState("");
  const [history] = useState([
    { id: "c1", title: "AP triage — July" },
    { id: "c2", title: "RGPD retention questions" },
  ]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const user: Msg = { id: `u-${Date.now()}`, role: "user", text: trimmed };
    const reply: Msg = {
      id: `a-${Date.now()}`,
      role: "assistant",
      text: `Mock reply: I searched the archive for “${trimmed}”. Found 3 documents — open OCR review for Contract-Renewal-Q3?`,
    };
    setMessages((m) => [...m, user, reply]);
    setInput("");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
      <Card className="flex flex-col gap-3 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--dm-color-muted)]">
          History
        </p>
        <ul className="flex flex-col gap-1">
          {history.map((h) => (
            <li key={h.id}>
              <button type="button" className="dm-sidebar__link w-full text-left">
                {h.title}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-auto border-t border-[var(--dm-color-border)] pt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--dm-color-muted)]">
            Semantic search
          </p>
          <Search placeholder="Search meaning…" />
          <div className="mt-3 flex flex-col gap-2">
            <a href="/approvals">
              <Button size="sm" variant="outline" className="w-full justify-start">
                Pending approvals
              </Button>
            </a>
            <a href="/ocr/queue">
              <Button size="sm" variant="outline" className="w-full justify-start">
                Open OCR queue
              </Button>
            </a>
          </div>
        </div>
      </Card>

      <Card className="flex min-h-[32rem] flex-col p-4">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="text-[var(--dm-color-accent)]" size={18} />
          <h2 className="font-semibold">Giulia</h2>
        </div>
        <div className="flex flex-1 flex-col gap-3 overflow-auto">
          {messages.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="Start a conversation"
              description="Ask about documents in your tenant."
            />
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-[var(--dm-color-accent)] text-white"
                    : "bg-[var(--dm-color-accent-muted)] text-[var(--dm-color-foreground)]"
                }`}
              >
                {m.text}
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <Button key={s} size="sm" variant="outline" onClick={() => send(s)}>
              {s}
            </Button>
          ))}
        </div>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <Input
            aria-label="Message Giulia"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Giulia…"
          />
          <Button type="submit" variant="primary">
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
}
