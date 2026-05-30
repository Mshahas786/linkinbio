import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const products = await prisma.product.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, description, price, fileUrl, fileType, imageUrl } = await req.json()

  if (!title || !price) {
    return NextResponse.json({ error: "Title and price are required" }, { status: 400 })
  }

  const product = await prisma.product.create({
    data: {
      title,
      description,
      price: Math.round(price * 100),
      fileUrl,
      fileType,
      imageUrl,
      userId: session.user.id,
    },
  })

  return NextResponse.json(product, { status: 201 })
}
