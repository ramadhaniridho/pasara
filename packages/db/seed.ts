import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.doctorAppointment.deleteMany()
  await prisma.schedule.deleteMany()
  await prisma.doctor.deleteMany()
  await prisma.user.deleteMany()

  const pasien = await prisma.user.create({
    data: { name: "Budi Santoso", email: "budi@mail.com", phone: "08123456789", role: "PATIENT" },
  })

  const SPECIALIZATIONS = ["Spesialis Kulit", "Psikolog", "Dokter Gigi", "Spesialis Anak", "Spesialis Mata"]
  const HOSPITALS = ["RS Siloam", "RS Pondok Indah", "RS Borromeus", "RS Dr. Soetomo", "RS Cipto"]
  const CITIES = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Medan"]
  const NAMES = ["Andi", "Sari", "Bambang", "Dewi", "Fajar", "Gita", "Hadi", "Intan", "Joko", "Kiki", "Lina", "Mira", "Nando", "Oka", "Putri"]

  for (let i = 0; i < 15; i++) {
    const d = await prisma.doctor.create({
      data: {
        name: `dr. ${NAMES[i]}`,
        specialization: SPECIALIZATIONS[i % SPECIALIZATIONS.length],
        location: CITIES[i % CITIES.length],
        hospital: HOSPITALS[i % HOSPITALS.length],
        price: 150000 + Math.floor(Math.random() * 300000 / 5000) * 5000,
      },
    })
    await prisma.schedule.createMany({
      data: [1, 2, 3, 4, 5].flatMap(day => [
        { doctorId: d.id, dayOfWeek: day, startTime: "08:00", endTime: "12:00" },
        { doctorId: d.id, dayOfWeek: day, startTime: "13:00", endTime: "17:00" },
      ]),
    })
  }

  console.log(`✅ seeded 15 doctors + schedules + 1 patient`)
}

main()
