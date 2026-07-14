# Deployment & Maintenance Plan — Klinik Gigi Sehatin

## HOSTING
- **Platform:** Vercel (Hobby — free tier)
- **Database:** Neon (serverless Postgres — free tier 0.5GB)
- **Domain:** kustom domain (clinicname.dental atau .com)
- **SSL:** auto via Vercel

## DEPLOYMENT
1. Push ke GitHub (ramadhaniridho/pasara)
2. Vercel import repo → pilih apps/web
3. Set env `DATABASE_URL` → run seed
4. Deploy — selesai ( < 5 menit )

## CI/CD
- Auto-deploy on push ke main
- Build check via GitHub Actions (lint + typecheck + build)

## MAINTENANCE

### Tipe 1 (self-manage)
| Task | Frekuensi |
|---|---|
| Update konten (foto, promo) | Kapan aja via code PR |
| DB backup | Auto by Neon |
| SSL renewal | Auto by Vercel |

### Tipe 2 (kami handle 6 bulan)
Kami update: foto layanan, promo terbaru, info dokter, jam operasional.
Commit → push → auto deploy. 0 effort owner.

### Tipe 3 (all)
Semua Tipe 2 +:
- Monitor booking tiap hari (admin panel)
- Update status booking harian
- WA notifikasi (manual via admin atau integrasi WA API di fase 2)

## MONITORING
- **Uptime:** Vercel status page
- **Error:** Vercel logs
- **DB:** Neon dashboard

## PONTAIL — FASE 2
- Integrasi SATUSEHAT (rekam medis)
- WA API otomatis (Twilio/WATI)
- Multi-clinic support
- Dashboard analitik (booking per bulan, dokter favorit, dll)
- Double booking prevention
