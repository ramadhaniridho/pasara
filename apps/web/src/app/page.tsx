"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/specializations").then(r => r.json()).then(setSpecs)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filterSpec) params.set("specialization", filterSpec)
    if (search) params.set("search", search)
    fetch(`/api/doctors?${params}`).then(r => r.json()).then(d => {
      setDoctors(d)
      setLoading(false)
    })
  }, [filterSpec, search])

  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <h1 className="font-bold text-xl tracking-tight">Sehatin</h1>
        <Select value={filterSpec} onValueChange={setFilterSpec}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Semua Spesialis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Spesialis</SelectItem>
            {specs.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input placeholder="Cari dokter..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
      </header>

      <main className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5 space-y-3">
              <Skeleton className="w-14 h-14 rounded-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
          </Card>
        ))}
        {!loading && doctors.map(d => (
          <a key={d.id} href={`/doctors/${d.id}`} className="block">
            <Card className="hover:shadow-md transition cursor-pointer">
              <CardContent className="p-5">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary mb-3">
                  {d.name[0]}
                </div>
                <h2 className="font-semibold">{d.name}</h2>
                <Badge variant="secondary" className="mt-1 text-xs">{d.specialization}</Badge>
                <p className="text-xs text-muted-foreground mt-1">{d.hospital} · {d.location}</p>
                {d.price && <p className="text-sm font-semibold mt-2">Rp{d.price.toLocaleString()}</p>}
                <div className="flex gap-1 mt-2 flex-wrap">
                  {d.schedules.slice(0, 5).map(s => (
                    <span key={s.dayOfWeek} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{days[s.dayOfWeek]} {s.startTime}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </main>
    </div>
  )
}