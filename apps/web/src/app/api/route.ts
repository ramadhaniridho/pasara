import { NextResponse } from "next/server"
import { prisma } from "@pasara/db"

export const dynamic = "force-dynamic"

const R = (data: unknown, status = 200) => NextResponse.json(data, { status })

export async function GET(req: Request) {
  const url = new URL(req.url)
  const path = url.pathname

  const clinic = await prisma.clinic.findFirst({ include: { doctors: { include: { schedules: true } }, services: { orderBy: { sortOrder: "asc" } }, promotions: { where: { active: true } } } })
  if (!clinic) return R({ error: "no clinic" }, 404)

  if (path === "/api/clinic") return R(clinic)
  if (path === "/api/doctors") return R(clinic.doctors)
  if (path === "/api/services") return R(clinic.services)
  if (path === "/api/promotions") return R(clinic.promotions)

  const idMatch = path.match(/^\/api\/doctors\/(.+)$/)
  if (idMatch) {
    const doc = clinic.doctors.find(d => d.id === idMatch[1])
    return doc ? R(doc) : R({ error: "not found" }, 404)
  }

  return R({ error: "not found" }, 404)
}

export async function POST(req: Request) {
  const url = new URL(req.url)
  const path = url.pathname

  if (path === "/api/appointments") {
    const body = await req.json()
    const apt = await prisma.appointment.create({ data: body })
    return R(apt, 201)
  }

  if (path === "/api/appointments/update") {
    const { id, status } = await req.json()
    const apt = await prisma.appointment.update({ where: { id }, data: { status } })
    return R(apt)
  }

  return R({ error: "not found" }, 404)
}
