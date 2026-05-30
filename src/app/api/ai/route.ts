import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { type, prompt } = await req.json()

  if (!type || !prompt) {
    return NextResponse.json({ error: "Type and prompt are required" }, { status: 400 })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 })
  }

  const systemMessages: Record<string, string> = {
    bio: "You are a creative bio writer. Generate a short, engaging bio (max 150 characters) based on the user's description. Return only the bio text, no quotes or formatting.",
    link_description: "You are a copywriter. Generate a catchy, clickable description for a link (max 80 characters). Return only the text.",
    page_title: "You are a creative title generator. Generate a short, catchy page title (max 50 characters). Return only the title.",
    color_scheme: "You are a color palette designer. Based on the user's description, suggest a hex color code for an accent color. Return ONLY a hex color like #c04a2b.",
  }

  const systemMessage = systemMessages[type] || systemMessages.bio

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    })

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content || ""

    return NextResponse.json({ text })
  } catch {
    return NextResponse.json({ error: "AI request failed" }, { status: 500 })
  }
}
