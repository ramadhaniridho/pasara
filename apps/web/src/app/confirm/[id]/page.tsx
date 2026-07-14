import { prisma } from "@pasara/db"

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

  if (!user) return <div className="p-6 text-center"><h1 className="font-bold text-xl">User tidak ditemukan</h1><a href="/" className="text-blue-600">Kembali</a></div>

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl border p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-3xl">✓</div>
        <h1 className="text-xl font-bold">Booking Berhasil!</h1>
        <p className="text-sm text-slate-500">Janji temu kamu sudah tercatat.</p>

        <div className="text-left space-y-3">
          <h2 className="font-semibold text-sm">Riwayat Booking</h2>
          {user.appointments.length === 0 && <p className="text-xs text-slate-400">Belum ada booking</p>}
          {user.appointments.map(a => (
            <div key={a.id} className="border rounded-lg p-3 text-sm">
              <p className="font-medium">{a.doctor?.name}</p>
              <p className="text-xs text-slate-500">{a.doctor?.specialization} · {a.doctor?.hospital}</p>
              <p className="text-xs text-slate-400">{new Date(a.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} jam {a.time}</p>
              {a.notes && <p className="text-xs text-slate-500 mt-1 italic">"{a.notes}"</p>}
              <span className={`text-xs font-medium ${a.status === "confirmed" ? "text-green-600" : a.status === "cancelled" ? "text-red-500" : "text-yellow-500"}`}>
                {a.status === "pending" ? "Menunggu konfirmasi" : a.status === "confirmed" ? "Dikonfirmasi" : "Dibatalkan"}
              </span>
            </div>
          ))}
        </div>

        <a href="/" className="inline-block text-blue-600 text-sm">← Cari dokter lain</a>
      </div>
    </div>
  )
}
