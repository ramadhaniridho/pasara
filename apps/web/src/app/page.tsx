import { prisma } from "@pasara/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const clinic = await prisma.clinic.findFirst({
    include: {
      doctors: true,
      services: { orderBy: { sortOrder: "asc" } },
      promotions: { where: { active: true } },
    },
  })
  if (!clinic) return <div className="p-10 text-center">Klinik not found</div>

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="bg-gradient-to-br from-cyan-600 to-cyan-800 text-white px-6 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold tracking-tight">{clinic.name}</h1>
          <p className="text-sm xs:text-base text-cyan-100 max-w-xl mx-auto">{clinic.about}</p>
          <p className="text-sm text-cyan-200">{clinic.openDays} · {clinic.openHours}</p>
          <div className="flex flex-col xs:flex-row gap-3 justify-center pt-4">
            <Button size="lg" className="bg-white text-cyan-700 hover:bg-cyan-50" asChild>
              <a href={`https://wa.me/${clinic.phone}`}>Booking via WhatsApp</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-cyan-700" asChild>
              <Link href="/booking">Booking Online</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* LAYANAN */}
      <section id="services" className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        <h2 className="text-2xl font-bold text-center">Layanan Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clinic.services.map(s => (
            <Card key={s.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-semibold text-lg">{s.name}</h3>
                <p className="text-sm text-slate-500">{s.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <p className="font-bold text-lg">{s.price === 0 ? "GRATIS" : `Rp${s.price?.toLocaleString()}`}</p>
                  {s.duration && <Badge variant="secondary">{s.duration} menit</Badge>}
                </div>
                <Button variant="link" size="sm" className="p-0" asChild>
                  <Link href={`/layanan/${s.slug}`}>Detail →</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* DOKTER */}
      <section id="doctors" className="bg-slate-50 px-6 py-16">
        <div className="max-w-5xl mx-auto space-y-8">
          <h2 className="text-2xl font-bold text-center">Dokter Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clinic.doctors.map(d => (
              <Card key={d.id}>
                <CardContent className="p-5 text-center space-y-2">
                  <div className="w-20 h-20 rounded-full bg-cyan-100 mx-auto flex items-center justify-center text-2xl font-bold text-cyan-600">{d.name[4]}</div>
                  <h3 className="font-semibold">{d.name}</h3>
                  <p className="text-sm text-slate-500">{d.specialty}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO */}
      {clinic.promotions.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-16 space-y-8">
          <h2 className="text-2xl font-bold text-center">Promo Spesial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clinic.promotions.map(p => (
              <Card key={p.id} className="border-2 border-amber-400">
                <CardContent className="p-5 space-y-2">
                  <Badge className="bg-amber-400 text-amber-900">Promo</Badge>
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  {p.description && <p className="text-sm text-slate-500">{p.description}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* BOOKING */}
      <section id="booking" className="bg-white px-6 py-16">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-center">Booking Janji Temu</h2>
          <p className="text-sm text-slate-500 text-center">Pilih layanan, dokter, dan jadwal. Kami konfirmasi via WhatsApp.</p>
          <div className="flex flex-col gap-3">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" asChild>
              <a href={`https://wa.me/${clinic.phone}?text=Halo%20${encodeURIComponent(clinic.name)}%2C%20saya%20mau%20booking%20janji%20temu`}>
                Booking via WhatsApp
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/booking">Booking Online</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* KONTAK */}
      <section className="bg-slate-900 text-white px-6 py-12">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-bold">Kontak</h2>
          <p className="text-slate-300">{clinic.address}</p>
          <p className="text-slate-300">{clinic.openDays} · {clinic.openHours}</p>
          <p className="text-slate-300">{clinic.email}</p>
          <Button variant="outline" className="border-white text-white mt-2 hover:bg-slate-800" asChild>
            <a href={`tel:${clinic.phone}`}>Telpon {clinic.phone}</a>
          </Button>
        </div>
      </section>
    </div>
  )
}
