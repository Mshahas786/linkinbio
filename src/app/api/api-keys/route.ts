import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import crypto from "crypto"

const API_KEYS: Record<string, { key: string; name: string }[]> = {}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const keys = API_KEYS[session.user.id] || []
  return NextResponse.json(keys.map((k) => ({ name: k.name, prefix: k.key.slice(0, 8) + "..." })))
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name } = await req.json()
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }

  const key = `flo_${crypto.randomBytes(24).toString("hex")}`
  if (!API_KEYS[session.user.id]) API_KEYS[session.user.id] = []
  API_KEYS[session.user.id].push({ key, name })

  return NextResponse.json({ key, name })
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name } = await req.json()
  if (!API_KEYS[session.user.id]) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  API_KEYS[session.user.id] = API_KEYS[session.user.id].filter((k) => k.name !== name)
  return NextResponse.json({ success: true })
}
