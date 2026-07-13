import { NextResponse } from "next/server"
import { prisma } from "@pasara/db"

export const dynamic = "force-dynamic"

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { snapshots: { orderBy: { scrapedAt: "asc" } } },
  })
  if (!product) return NextResponse.json({ error: "not found" }, { status: 404 })
  return NextResponse.json(product)
}
