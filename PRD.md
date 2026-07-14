# PRD — Klinik Gigi Sehatin

## 1. LATAR BELAKANG
Owner klinik gigi UMKM di Indonesia belum punya website. Pasien masih booking via telpon/WA manual — sering bentrok, lupa, gak ada catatan terpusat.

Solusi: web murah, cepat, simpel. Hosting include. No lemot.

## 2. TARGET USER
- **Owner klinik gigi** — belum punya web, mau yg simpel + cepat + murah
- **Pasien** — cari info layanan, liat dokter, booking online

## 3. TIAPE LAYANAN

| Tipe | Fitur | Harga bayangan |
|---|---|---|
| **Tipe 1** | Landing page + info klinik + layanan + dokter + promo. Booking → WA aja | 500K-1jt |
| **Tipe 2** | Tipe 1 + kami handle update foto/promo 6 bulan | 1.5jt-2jt/thn |
| **Tipe 3** | Tipe 1 + sistem booking online real-time. WA notifikasi. Admin panel. | 2.5jt-4jt |

## 4. FITUR (Tipe 3 = full)

| # | Fitur | Tipe1 | Tipe2 | Tipe3 |
|---|---|---|---|---|
| 1 | Hero + about clinic | ✓ | ✓ | ✓ |
| 2 | Layanan + harga | ✓ | ✓ | ✓ |
| 3 | Dokter + jadwal | ✓ | ✓ | ✓ |
| 4 | Promo slider | ✓ | ✓ | ✓ |
| 5 | Kontak + maps | ✓ | ✓ | ✓ |
| 6 | Booking → WhatsApp | ✓ | ✓ | ✓ |
| 7 | Update konten 6 bulan | ✗ | ✓ | ✗ |
| 8 | Booking online real-time | ✗ | ✗ | ✓ |
| 9 | Admin panel (kelola booking) | ✗ | ✗ | ✓ |
| 10 | WA notifikasi booking | ✗ | ✗ | ✓ |
| 11 | Hosting include 1 thn | ✓ | ✓ | ✓ |

## 5. STACK
Next.js 15 + Tailwind + shadcn/ui + Prisma + PostgreSQL (Neon). Vercel deploy.

## 6. SATUSEHAT
Koneksi ke SATUSEHAT untuk rekam medis elektronik — fase 2. Tipe 3+.
