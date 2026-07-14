import { prisma } from "@pasara/db"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await prisma.service.findFirst({ where: { slug }, include: { clinic: true } })
  if (!service) notFound()

  const meta = {
    title: `${service.name} - ${service.clinic.name}`,
    description: service.description ?? `Layanan ${service.name} di ${service.clinic.name}`,
  }

  return (
    <>
      <head><title>{meta.title}</title><meta name="description" content={meta.description} /></head>
      <div className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-cyan-600 to-cyan-800 text-white px-6 py-20">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Badge className="bg-white/20 text-white border-0">Layanan</Badge>
            <h1 className="text-3xl md:text-4xl font-bold">{service.name}</h1>
            {service.description && <p className="text-lg text-white/80">{service.description}</p>}
            <div className="flex items-center justify-center gap-4 pt-2">
              {service.price !== null && (
                <span className="text-2xl font-bold">{service.price === 0 ? "GRATIS" : `Rp${service.price.toLocaleString()}`}</span>
              )}
              {service.duration && <Badge className="bg-white/20 text-white border-0">{service.duration} menit</Badge>}
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-16 space-y-6 text-center">
          <h2 className="text-xl font-semibold">Tertarik dengan layanan ini?</h2>
          <p className="text-slate-500">Booking online atau hubungi kami via WhatsApp.</p>
          <div className="flex gap-3 justify-center">
            <Button asChild><Link href="/booking">Booking Online</Link></Button>
            <Button variant="outline" asChild><Link href={`https://wa.me/${service.clinic.phone?.replace(/[^0-9]/g, "")}`}>WhatsApp</Link></Button>
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Button variant="ghost" asChild><Link href="/">← Kembali ke Beranda</Link></Button>
          </div>
        </section>
      </div>
    </>
  )
}
