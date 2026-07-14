import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.appointment.deleteMany()
  await prisma.promotion.deleteMany()
  await prisma.schedule.deleteMany()
  await prisma.service.deleteMany()
  await prisma.doctor.deleteMany()
  await prisma.clinic.deleteMany()

  const clinic = await prisma.clinic.create({
    data: {
      name: "Klinik Gigi Sehatin",
      slug: "sehatin",
      address: "Jl. Sudirman No. 123, Jakarta Pusat",
      phone: "6281234567890",
      email: "info@sehatin.dental",
      about: "Klinik Gigi Sehatin adalah klinik gigi modern dengan dokter-dokter berpengalaman. Kami melayani berbagai perawatan gigi dengan harga terjangkau dan pelayanan ramah.",
      openDays: "Senin - Sabtu",
      openHours: "08:00 - 20:00",
    },
  })

  const doctors = await Promise.all([
    prisma.doctor.create({
      data: { clinicId: clinic.id, name: "drg. Andi Pratama", specialty: "Dokter Gigi Umum", photo: null },
    }),
    prisma.doctor.create({
      data: { clinicId: clinic.id, name: "drg. Sari Dewi", specialty: "Spesialis Ortodonti (Behel)", photo: null },
    }),
    prisma.doctor.create({
      data: { clinicId: clinic.id, name: "drg. Bambang Santoso", specialty: "Spesialis Bedah Mulut", photo: null },
    }),
  ])

  const days = [1, 2, 3, 4, 5, 6]
  for (const d of doctors) {
    await prisma.schedule.createMany({
      data: days.flatMap(day => [
        { doctorId: d.id, dayOfWeek: day, startTime: "09:00", endTime: "12:00" },
        { doctorId: d.id, dayOfWeek: day, startTime: "14:00", endTime: "17:00" },
      ]),
    })
  }

  await prisma.service.createMany({
    data: [
      { clinicId: clinic.id, name: "Cek Gigi", description: "Pemeriksaan gigi lengkap", price: 50000, duration: 30 },
      { clinicId: clinic.id, name: "Scaling / Pembersihan Karang Gigi", description: "Bersihkan karang dan noda gigi", price: 150000, duration: 45 },
      { clinicId: clinic.id, name: "Tambal Gigi", description: "Tambal gigi berlubang (per gigi)", price: 200000, duration: 60 },
      { clinicId: clinic.id, name: "Cabut Gigi", description: "Cabut gigi tanpa operasi", price: 250000, duration: 30 },
      { clinicId: clinic.id, name: "Behel / Ortodonti", description: "Konsultasi + pasang behel", price: 3500000, duration: 90 },
      { clinicId: clinic.id, name: "Bleaching / Pemutih Gigi", description: "Whitening treatment", price: 500000, duration: 60 },
      { clinicId: clinic.id, name: "Pasang Mahkota Gigi", description: "Mahkota gigi porselen", price: 1500000, duration: 90 },
      { clinicId: clinic.id, name: "Konsultasi Gratis", description: "Konsultasi dengan dokter gigi", price: 0, duration: 15 },
    ],
  })

  await prisma.promotion.createMany({
    data: [
      { clinicId: clinic.id, title: "Scaling Gratis • Beli 2 Dapat 3", description: "Promo spesial! Scaling 3x bayar 2x saja. Berlaku untuk pasien baru.", active: true },
      { clinicId: clinic.id, title: "Behel Mulai 3,5 Juta", description: "Pasang behel mulai Rp3.500.000 (sudah termasuk retainer pertama). Cicilan 0% tersedia.", active: true },
    ],
  })

  console.log(`✅ seeded: ${clinic.name}`)
}

main()
