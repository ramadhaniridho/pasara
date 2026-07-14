"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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

  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

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
          const [sh, sm] = schedule.startTime.split(":").map(Number)
          const [eh, em] = schedule.endTime.split(":").map(Number)
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
    // auto-login — ponytail: no real auth
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

  if (!doctor) return <div className="p-6">Loading...</div>

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-4"><a href="/" className="text-blue-600 text-sm">← Kembali</a></header>
      <main className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-xl border p-6 flex gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">{doctor.name[0]}</div>
          <div>
            <h1 className="text-xl font-bold">{doctor.name}</h1>
            <p className="text-blue-600 font-medium">{doctor.specialization}</p>
            <p className="text-sm text-slate-500">{doctor.hospital} · {doctor.location}</p>
            {doctor.price && <p className="text-lg font-bold mt-2">Rp{doctor.price.toLocaleString()}</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Pilih Jadwal</h2>
          <div className="max-h-40 overflow-y-auto flex flex-wrap gap-2">
            {slots.map(s => {
              const key = `${s.date}|${s.time}`
              return (
                <button key={key} onClick={() => setSelectedSlot(key)}
                  className={`px-3 py-1.5 rounded-lg border text-xs transition ${selectedSlot === key ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-slate-50"}`}>
                  {new Date(s.date + "T00:00:00").toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })} {s.time}
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold">Data Diri</h2>
          <input className="w-full border rounded-lg px-4 py-2 text-sm" placeholder="Nama lengkap *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="w-full border rounded-lg px-4 py-2 text-sm" placeholder="No. HP" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <input className="w-full border rounded-lg px-4 py-2 text-sm" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <textarea className="w-full border rounded-lg px-4 py-2 text-sm" placeholder="Alasan mendaftar / keluhan (opsional)" value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} />
          <button onClick={handleBook} disabled={!selectedSlot || !form.name} className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium disabled:opacity-50">
            Booking Janji Temu
          </button>
        </div>

<script dangerouslySetInnerHTML={{ __html: `// ponytail: date label — inline, no lib
document.querySelectorAll(".slot-btn").forEach(b => {
  const d = b.dataset.date
  if (d) {
    const dt = new Date(d + "T00:00:00")
    const days = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"]
    b.dataset.dayLabel = days[dt.getDay()]
  }
})` }} />
      </main>
    </div>
  )
}
