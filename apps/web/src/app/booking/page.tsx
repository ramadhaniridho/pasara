"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

type Doctor = { id: string; name: string; specialty: string; schedules: { dayOfWeek: number; startTime: string; endTime: string }[] }
type Service = { id: string; name: string; price: number | null; duration: number | null }

export default function BookingPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" })
  const [anamnesis, setAnamnesis] = useState({ penyakit: "", penyakitDesc: "", hamil: "", alergi: "", alergiDesc: "", obat: "", obatDesc: "", merokok: "", sikatGigi: "", terakhirKeDokter: "" })
  const [slots, setSlots] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/services").then(r => r.json()).then(setServices)
    fetch("/api/doctors").then(r => r.json()).then(setDoctors)
  }, [])

  const handleDateChange = (d: string) => {
    setDate(d)
    setTime("")
    if (!d || !selectedDoctor) return
    const dow = new Date(d + "T00:00:00").getDay()
    const doc = doctors.find(doc => doc.id === selectedDoctor)
    if (!doc) return
    const schedule = doc.schedules.find(s => s.dayOfWeek === dow)
    if (!schedule) { setSlots([]); return }
    const [sh] = schedule.startTime.split(":").map(Number)
    const [eh] = schedule.endTime.split(":").map(Number)
    const s: string[] = []
    for (let h = sh; h < eh; h++) s.push(`${String(h).padStart(2, "0")}:00`)
    setSlots(s)
  }

  const handleSubmit = async () => {
    if (!selectedService || !selectedDoctor || !date || !time || !form.name) return
    const body = {
      doctorId: selectedDoctor,
      service: services.find(s => s.id === selectedService)?.name || "",
      date: new Date(date + "T00:00:00"),
      time,
      patientName: form.name,
      patientPhone: form.phone,
      patientEmail: form.email,
      notes: [form.notes, Object.entries(anamnesis).filter(([_,v]) => v).map(([k,v]) => `${k}: ${v}`).join("\n")].filter(Boolean).join("\n---\n"),
      status: "pending",
    }
    const res = await fetch("/api/appointments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    if (res.ok) setDone(true)
  }

  if (done) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-3xl">✓</div>
          <h1 className="font-bold text-xl">Booking Berhasil!</h1>
          <p className="text-sm text-slate-500">Kami akan konfirmasi via WhatsApp.</p>
          <Button onClick={() => router.push("/")}>Kembali</Button>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b px-6 py-4"><a href="/" className="text-sm text-cyan-600">← Beranda</a></header>
      <main className="max-w-xl mx-auto p-6 space-y-4">
        <h1 className="text-xl font-bold">Booking Online</h1>

        <div className="space-y-2">
          <label className="text-sm font-medium">Layanan *</label>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger><SelectValue placeholder="Pilih layanan" /></SelectTrigger>
            <SelectContent>
              {services.map(s => <SelectItem key={s.id} value={s.id}>{s.name} {s.price ? `(Rp${s.price.toLocaleString()})` : ""}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Dokter *</label>
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger><SelectValue placeholder="Pilih dokter" /></SelectTrigger>
            <SelectContent>
              {doctors.map(d => <SelectItem key={d.id} value={d.id}>{d.name} — {d.specialty}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tanggal *</label>
          <Input type="date" value={date} onChange={e => handleDateChange(e.target.value)} />
        </div>

        {slots.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Jam *</label>
            <div className="flex flex-wrap gap-2">
              {slots.map(s => (
                <Button key={s} variant={time === s ? "default" : "outline"} size="sm" onClick={() => setTime(s)}>
                  {s}
                </Button>
              ))}
            </div>
          </div>
        )}
        {slots.length === 0 && date && <p className="text-xs text-slate-400">Tidak ada jadwal tersedia untuk tanggal ini</p>}

        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Lengkap *</label>
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">No. WhatsApp</label>
          <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="08xxxxxxxxxx" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Keluhan</label>
          <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Sampaikan keluhan Anda..." />
        </div>

        <details className="border rounded-xl p-4 space-y-3 text-sm">
          <summary className="font-semibold cursor-pointer text-sm text-cyan-700">📋 Anamnesis — Riwayat Kesehatan (opsional)</summary>
          <p className="text-xs text-slate-400">Informasi ini membantu dokter gigi memahami kondisi Anda sebelum pemeriksaan.</p>

          <div><label className="text-xs font-medium">Apakah Anda memiliki penyakit tertentu? (diabetes, jantung, hipertensi, dll)</label>
          <div className="flex gap-2 mt-1">{[["tidak","Tidak"],["ya","Ya"]].map(([v,l]) => <Button key={v} type="button" variant={anamnesis.penyakit===v?"default":"outline"} size="sm" onClick={()=>setAnamnesis({...anamnesis,penyakit:v})}>{l}</Button>)}</div>
          {anamnesis.penyakit==="ya" && <Input className="mt-2" value={anamnesis.penyakitDesc} onChange={e=>setAnamnesis({...anamnesis,penyakitDesc:e.target.value})} placeholder="Sebutkan..." />}</div>

          <div><label className="text-xs font-medium">Apakah Anda sedang hamil / menyusui?</label>
          <div className="flex gap-2 mt-1">{[["tidak","Tidak"],["ya","Ya"]].map(([v,l]) => <Button key={v} type="button" variant={anamnesis.hamil===v?"default":"outline"} size="sm" onClick={()=>setAnamnesis({...anamnesis,hamil:v})}>{l}</Button>)}</div></div>

          <div><label className="text-xs font-medium">Apakah Anda punya alergi? (obat, lateks, dll)</label>
          <div className="flex gap-2 mt-1">{[["tidak","Tidak"],["ya","Ya"]].map(([v,l]) => <Button key={v} type="button" variant={anamnesis.alergi===v?"default":"outline"} size="sm" onClick={()=>setAnamnesis({...anamnesis,alergi:v})}>{l}</Button>)}</div>
          {anamnesis.alergi==="ya" && <Input className="mt-2" value={anamnesis.alergiDesc} onChange={e=>setAnamnesis({...anamnesis,alergiDesc:e.target.value})} placeholder="Sebutkan alergi..." />}</div>

          <div><label className="text-xs font-medium">Apakah sedang minum obat rutin?</label>
          <div className="flex gap-2 mt-1">{[["tidak","Tidak"],["ya","Ya"]].map(([v,l]) => <Button key={v} type="button" variant={anamnesis.obat===v?"default":"outline"} size="sm" onClick={()=>setAnamnesis({...anamnesis,obat:v})}>{l}</Button>)}</div>
          {anamnesis.obat==="ya" && <Input className="mt-2" value={anamnesis.obatDesc} onChange={e=>setAnamnesis({...anamnesis,obatDesc:e.target.value})} placeholder="Sebutkan obat..." />}</div>

          <div><label className="text-xs font-medium">Apakah Anda merokok?</label>
          <div className="flex gap-2 mt-1">{[["tidak","Tidak"],["ya","Ya"]].map(([v,l]) => <Button key={v} type="button" variant={anamnesis.merokok===v?"default":"outline"} size="sm" onClick={()=>setAnamnesis({...anamnesis,merokok:v})}>{l}</Button>)}</div></div>

          <div><label className="text-xs font-medium">Seberapa sering sikat gigi per hari?</label>
          <Input value={anamnesis.sikatGigi} onChange={e=>setAnamnesis({...anamnesis,sikatGigi:e.target.value})} placeholder="Contoh: 2x sehari" /></div>

          <div><label className="text-xs font-medium">Kapan terakhir ke dokter gigi?</label>
          <Input value={anamnesis.terakhirKeDokter} onChange={e=>setAnamnesis({...anamnesis,terakhirKeDokter:e.target.value})} placeholder="Contoh: 6 bulan lalu / tidak pernah" /></div>
        </details>

        <Button onClick={handleSubmit} disabled={!selectedService || !selectedDoctor || !date || !time || !form.name} className="w-full" size="lg">
          Booking Sekarang
        </Button>
      </main>
    </div>
  )
}
