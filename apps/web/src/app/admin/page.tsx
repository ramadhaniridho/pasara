import { prisma } from "@pasara/db"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const appointments = await prisma.appointment.findMany({
    orderBy: { createdAt: "desc" },
    include: { doctor: { select: { name: true, specialty: true } } },
  })

  async function updateStatus(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    const status = formData.get("status") as string
    await prisma.appointment.update({ where: { id }, data: { status } })
  }

  const counts = {
    pending: appointments.filter(a => a.status === "pending").length,
    confirmed: appointments.filter(a => a.status === "confirmed").length,
    done: appointments.filter(a => a.status === "done").length,
    cancelled: appointments.filter(a => a.status === "cancelled").length,
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-xl font-bold">Admin — Booking</h1>

        <div className="flex flex-wrap gap-4 text-sm">
          <span>Pending: <strong>{counts.pending}</strong></span>
          <span>Confirmed: <strong>{counts.confirmed}</strong></span>
          <span>Done: <strong>{counts.done}</strong></span>
          <span>Cancelled: <strong>{counts.cancelled}</strong></span>
        </div>

        <div className="space-y-3">
          {appointments.map(a => (
            <Card key={a.id}>
              <CardContent className="p-4 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{a.patientName}</p>
                  <p className="text-slate-500">{a.doctor.name} · {a.service}</p>
                  <p className="text-slate-400">{new Date(a.date).toLocaleDateString("id-ID")} jam {a.time}</p>
                  {a.patientPhone && <p className="text-slate-400">{a.patientPhone}</p>}
                  {a.notes && <p className="text-slate-400 italic">"{a.notes}"</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={a.status === "pending" ? "secondary" : a.status === "confirmed" ? "default" : a.status === "done" ? "default" : "destructive"}>
                    {a.status}
                  </Badge>
                  <form action={updateStatus}>
                    <input type="hidden" name="id" value={a.id} />
                    <select name="status" className="text-xs border rounded px-2 py-1" onChange={e => e.target.form?.requestSubmit()}>
                      <option value="pending" disabled={a.status === "pending"}>pending</option>
                      <option value="confirmed" disabled={a.status === "confirmed"}>confirmed</option>
                      <option value="done" disabled={a.status === "done"}>done</option>
                      <option value="cancelled" disabled={a.status === "cancelled"}>cancelled</option>
                    </select>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
          {appointments.length === 0 && <p className="text-sm text-slate-400">Belum ada booking.</p>}
        </div>
      </div>
    </div>
  )
}
