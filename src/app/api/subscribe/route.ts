import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

async function syncEmailIntegration(userId: string, email: string) {
  const integrations = await prisma.integration.findMany({
    where: { userId, enabled: true },
  })

  for (const integration of integrations) {
    if (integration.provider === "mailchimp" && integration.key) {
      try {
        const [dc, apiKey] = integration.key.split("-")
        await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${integration.value}/members`, {
          method: "POST",
          headers: { Authorization: `apikey ${integration.key}`, "Content-Type": "application/json" },
          body: JSON.stringify({ email_address: email, status: "subscribed" }),
        })
      } catch {}
    }

    if (integration.provider === "convertkit" && integration.key) {
      try {
        await fetch("https://api.convertkit.com/v3/forms/" + integration.value + "/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: integration.key, email }),
        })
      } catch {}
    }

    if (integration.provider === "kit" && integration.key) {
      try {
        await fetch("https://api.kit.com/v3/forms/" + integration.value + "/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: integration.key, email }),
        })
      } catch {}
    }
  }
}

export async function POST(req: Request) {
  const { username, email } = await req.json()

  if (!username || !email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, enableEmailCapture: true },
  })

  if (!user || !user.enableEmailCapture) {
    return NextResponse.json({ error: "Not available" }, { status: 404 })
  }

  const existing = await prisma.subscriber.findUnique({
    where: { userId_email: { userId: user.id, email } },
  })

  if (!existing) {
    await prisma.subscriber.create({
      data: { userId: user.id, email },
    })
  }

  syncEmailIntegration(user.id, email)

  return NextResponse.json({ success: true })
}
