"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type Doctor = {
  id: string
  name: string
  specialization: string
  location: string | null
  hospital: string | null
  price: number | null
  about: string | null
  schedules: { dayOfWeek: number; startTime: string; endTime: string }[]
}

export default function DoctorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [slots, setSlots] = useState<{ date: string; time: string }[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" })

  useEffect(() => {
    fetch(`/api/doctors/${id}`).then(r => r.json()).then(d => {
      setDoctor(d)
      const s: { date: string; time: string }[] = []
      for (let i = 1; i <= 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() + i)
        const dow = date.getDay()
        const schedule = d.schedules.find((sch: { dayOfWeek: number }) => sch.dayOfWeek === dow)
        if (schedule) {
          const [sh] = schedule.startTime.split(":").map(Number)
          const [eh] = schedule.endTime.split(":").map(Number)
          for (let h = sh; h < eh; h++) {
            s.push({ date: date.toISOString().split("T")[0], time: `${String(h).padStart(2, "0")}:00` })
          }
        }
      }
      setSlots(s)
    })
  }, [id])

  const handleBook = async () => {
    if (!selectedSlot || !form.name) return
    const [date, time] = selectedSlot.split("|")
    const userRes = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email || `${form.name.replace(/\s/g, "").toLowerCase()}@temp.com` }),
    })
    const user = await userRes.json()
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId: id,
        patientId: user.id,
        date,
        time,
        notes: `${form.name} — ${form.phone || "-"}` + (form.notes ? ` | ${form.notes}` : ""),
      }),
    })
    if (res.ok) router.push(`/confirm/${user.id}`)
  }

  if (!doctor) return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-4 max-w-3xl mx-auto">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-40 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-4">
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground">← Kembali</a>
      </header>
      <main className="max-w-3xl mx-auto p-6 space-y-6">
        <Card>
          <CardContent className="p-6 flex gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
              {doctor.name[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold">{doctor.name}</h1>
              <Badge className="mt-1">{doctor.specialization}</Badge>
              <p className="text-sm text-muted-foreground mt-1">{doctor.hospital} · {doctor.location}</p>
              {doctor.price && <p className="text-lg font-bold mt-2">Rp{doctor.price.toLocaleString()}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">Pilih Jadwal</h2>
            <div className="max-h-40 overflow-y-auto flex flex-wrap gap-2">
              {slots.map(s => {
                const key = `${s.date}|${s.time}`
                return (
                  <Button key={key} variant={selectedSlot === key ? "default" : "outline"} size="sm" onClick={() => setSelectedSlot(key)}>
                    {new Date(s.date + "T00:00:00").toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })} {s.time}
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold">Data Diri</h2>
            <Input placeholder="Nama lengkap *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="No. HP" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <Input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Textarea placeholder="Alasan mendaftar / keluhan (opsional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            <Button onClick={handleBook} disabled={!selectedSlot || !form.name} className="w-full" size="lg">
              Booking Janji Temu
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
