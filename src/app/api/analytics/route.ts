import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event, petType, symptoms } = body
    console.log("[analytics]", new Date().toISOString(), event, petType, symptoms?.length)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}