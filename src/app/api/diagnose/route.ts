import { NextRequest, NextResponse } from "next/server"
import { getDiagnosisResult } from "@/lib/diagnosis"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { symptoms } = body
    if (!Array.isArray(symptoms)) {
      return NextResponse.json({ error: "symptoms array required" }, { status: 400 })
    }
    const results = getDiagnosisResult(symptoms)
    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}