import { NextResponse } from "next/server"
import { prisma } from "@pasara/db"

export const dynamic = "force-dynamic"

export async function GET() {
  const products = await prisma.product.findMany({
    include: { snapshots: { orderBy: { scrapedAt: "desc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  })

  const stats = {
    total: products.length,
    avgPrice: Math.round(products.reduce((s, p) => s + p.price, 0) / products.length),
    drops: products.filter((p) => p.price < 100000).length,
  }

  return NextResponse.json({ products, stats })
}
