"use client"

import { useEffect, useState } from "react"

type Doctor = {
  id: string
  name: string
  specialization: string
  location: string | null
  hospital: string | null
  price: number | null
  schedules: { dayOfWeek: number; startTime: string; endTime: string }[]
}

export default function HomePage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [specs, setSpecs] = useState<string[]>([])
  const [filterSpec, setFilterSpec] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/specializations").then(r => r.json()).then(setSpecs)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (filterSpec) params.set("specialization", filterSpec)
    if (search) params.set("search", search)
    fetch(`/api/doctors?${params}`).then(r => r.json()).then(setDoctors)
  }, [filterSpec, search])

  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <h1 className="font-bold text-xl">Sehatin</h1>
        <select className="border rounded-lg px-3 py-1.5 text-sm" value={filterSpec} onChange={e => setFilterSpec(e.target.value)}>
          <option value="">Semua Spesialis</option>
          {specs.map(s => <option key={s}>{s}</option>)}
        </select>
        <input className="border rounded-lg px-3 py-1.5 text-sm flex-1" placeholder="Cari dokter..." value={search} onChange={e => setSearch(e.target.value)} />
      </header>

      <main className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map(d => (
          <a key={d.id} href={`/doctors/${d.id}`} className="block bg-white rounded-xl border p-5 hover:shadow-md transition">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600 mb-3">
              {d.name[0]}
            </div>
            <h2 className="font-semibold">{d.name}</h2>
            <p className="text-sm text-blue-600 font-medium">{d.specialization}</p>
            <p className="text-xs text-slate-400 mt-1">{d.hospital} · {d.location}</p>
            {d.price && <p className="text-sm font-semibold mt-2">Rp{d.price.toLocaleString()}</p>}
            <div className="flex gap-1 mt-2 flex-wrap">
              {d.schedules.slice(0, 5).map(s => (
                <span key={s.dayOfWeek} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">{days[s.dayOfWeek]} {s.startTime}</span>
              ))}
            </div>
          </a>
        ))}
      </main>
    </div>
  )
}
