import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@pasara/db"

export const dynamic = "force-dynamic"

const R = (data: unknown, status = 200) => NextResponse.json(data, { status })

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const path = url.pathname

  // /api/doctors
  if (path === "/api/doctors") {
    const spec = url.searchParams.get("specialization") || undefined
    const search = url.searchParams.get("search") || undefined
    const doctors = await prisma.doctor.findMany({
      where: {
        ...(spec && { specialization: spec }),
        ...(search && { name: { contains: search, mode: "insensitive" } }),
      },
      include: { schedules: true },
    })
    return R(doctors)
  }

  // /api/doctors/:id
  const idMatch = path.match(/^\/api\/doctors\/(.+)$/)
  if (idMatch) {
    const doctor = await prisma.doctor.findUnique({
      where: { id: idMatch[1] },
      include: { schedules: true },
    })
    return doctor ? R(doctor) : R({ error: "not found" }, 404)
  }

  // /api/specializations
  if (path === "/api/specializations") {
    const specs = await prisma.doctor.findMany({
      select: { specialization: true },
      distinct: ["specialization"],
    })
    return R(specs.map(s => s.specialization))
  }

  return R({ error: "not found" }, 404)
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const path = url.pathname

  // /api/appointments — create booking
  if (path === "/api/appointments") {
    try {
      const body = await req.json()
      const apt = await prisma.doctorAppointment.create({
        data: {
          doctorId: body.doctorId,
          patientId: body.patientId,
          date: new Date(body.date),
          time: body.time,
          status: "pending",
          notes: body.notes || null,
        },
      })
      return R(apt, 201)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "unknown error"
      return R({ error: msg }, 400)
    }
  }

  // /api/login
  if (path === "/api/login") {
    const { email } = await req.json()
    if (!email) return R({ error: "email required" }, 400)
    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      user = await prisma.user.create({
        data: { name: email.split("@")[0], email, role: "PATIENT" },
      })
    }
    // strip sensitive — ponytail: no real auth
    const { password: _, ...safe } = user
    return R(safe)
  }

  return R({ error: "not found" }, 404)
}
