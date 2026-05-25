"use client"

import { useState, useEffect, useCallback } from "react"
import { ChatMessage } from "@/app/api/chat/[breedId]/route"

export default function ChatPanel({
  breedId,
  label,
  placeholder,
  sendLabel,
  emptyLabel,
  namePlaceholder,
  anonymousLabel,
}: {
  breedId: string
  label: string
  placeholder: string
  sendLabel: string
  emptyLabel: string
  namePlaceholder: string
  anonymousLabel: string
}) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [nickname, setNickname] = useState("")
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/${breedId}`)
      const data = await res.json()
      setMessages(data)
    } catch {}
  }, [breedId])

  useEffect(() => {
    if (open) fetchMessages()
  }, [open, fetchMessages])

  const handleSend = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/chat/${breedId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: nickname.trim() || anonymousLabel,
          message: text.trim(),
        }),
      })
      if (res.ok) {
        setText("")
        await fetchMessages()
      }
    } catch {} finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-8">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-stone-200 bg-white p-4 text-left hover:bg-stone-50 transition-colors"
      >
        <span className="font-semibold text-stone-800">{label}</span>
        <span className="text-stone-400 text-lg">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-2 rounded-xl border border-stone-200 bg-white p-4">
          <div className="max-h-80 space-y-3 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="py-8 text-center text-sm text-stone-400">{emptyLabel}</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="rounded-lg bg-stone-50 p-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-stone-700">{msg.nickname}</span>
                    <span className="text-xs text-stone-400">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-stone-600">{msg.message}</p>
                </div>
              ))
            )}
          </div>

          <div className="mt-3 space-y-2">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={namePlaceholder}
              maxLength={30}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSend() }}
                placeholder={placeholder}
                maxLength={500}
                className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={loading || !text.trim()}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
              >
                {sendLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}