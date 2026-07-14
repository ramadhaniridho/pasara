import { prisma } from "@pasara/db"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function ConfirmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      appointments: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { doctor: { select: { name: true, specialization: true, hospital: true } } },
      },
    },
  })

  if (!user) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-4">
          <h1 className="font-bold text-xl">User tidak ditemukan</h1>
          <a href="/" className="text-sm text-primary">Kembali</a>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-3xl">✓</div>
          <div>
            <h1 className="text-xl font-bold">Booking Berhasil!</h1>
            <p className="text-sm text-muted-foreground">Janji temu kamu sudah tercatat.</p>
          </div>

          <div className="text-left space-y-3">
            <h2 className="font-semibold text-sm">Riwayat Booking</h2>
            {user.appointments.length === 0 && <p className="text-xs text-muted-foreground">Belum ada booking</p>}
            {user.appointments.map(a => (
              <Card key={a.id}>
                <CardContent className="p-3 space-y-1 text-sm">
                  <p className="font-medium">{a.doctor?.name}</p>
                  <p className="text-xs text-muted-foreground">{a.doctor?.specialization} · {a.doctor?.hospital}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(a.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} jam {a.time}
                  </p>
                  {a.notes && <p className="text-xs text-muted-foreground mt-1 italic">"{a.notes}"</p>}
                  <Badge variant={a.status === "confirmed" ? "default" : a.status === "cancelled" ? "destructive" : "secondary"}>
                    {a.status === "pending" ? "Menunggu konfirmasi" : a.status === "confirmed" ? "Dikonfirmasi" : "Dibatalkan"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <a href="/" className="inline-block text-sm text-primary">← Cari dokter lain</a>
        </CardContent>
      </Card>
    </div>
  )
}
