import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const CHATS_DIR = path.join(process.cwd(), "data", "chats")

export type ChatMessage = {
  id: string
  nickname: string
  message: string
  timestamp: number
}

export type ChatData = {
  breedId: string
  messages: ChatMessage[]
}

function getMessages(breedId: string): ChatMessage[] {
  try {
    const filePath = path.join(CHATS_DIR, `${breedId}.json`)
    if (!fs.existsSync(filePath)) return []
    const raw = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveMessages(breedId: string, messages: ChatMessage[]) {
  if (!fs.existsSync(CHATS_DIR)) {
    fs.mkdirSync(CHATS_DIR, { recursive: true })
  }
  const filePath = path.join(CHATS_DIR, `${breedId}.json`)
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), "utf-8")
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ breedId: string }> }
) {
  const { breedId } = await params
  const messages = getMessages(breedId)
  return NextResponse.json(messages)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ breedId: string }> }
) {
  const { breedId } = await params
  const body = await request.json()

  const nickname = (body.nickname || "Anonymous").slice(0, 30)
  const message = (body.message || "").slice(0, 500).trim()

  if (!message) {
    return NextResponse.json({ error: "Message required" }, { status: 400 })
  }

  const messages = getMessages(breedId)
  const newMsg: ChatMessage = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    nickname,
    message,
    timestamp: Date.now(),
  }
  messages.push(newMsg)

  if (messages.length > 200) {
    messages.splice(0, messages.length - 200)
  }

  saveMessages(breedId, messages)
  return NextResponse.json(newMsg)
}