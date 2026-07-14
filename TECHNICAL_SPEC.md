# Technical Specification — Klinik Gigi Sehatin

## ARCHITECTURE
```
┌───────────────┐     ┌────────────────┐     ┌──────────┐
│  Vercel CDN   │────→│  Next.js 15    │────→│ Neon DB  │
│  (edge cache) │     │  (SSR/SSG)     │     │ Postgres │
└───────────────┘     └────────────────┘     └──────────┘
                              │
                    ┌─────────┴─────────┐
                    │  Admin (server)   │
                    │  Booking (csr)    │
                    └───────────────────┘
```

## TECH
- **Runtime:** Node 20+, pnpm 10
- **Framework:** Next.js 15 App Router
- **UI:** Tailwind CSS v3 + shadcn/ui
- **DB:** PostgreSQL (Neon serverless)
- **ORM:** Prisma 5
- **Host:** Vercel (Hobby — free)
- **Font:** Inter via next/font (self-hosted, 0 FOUT)

## API (3 endpoints)
- `GET /api/clinic` → clinic + doctors + schedules + services + promotions
- `POST /api/appointments` → create booking
- `POST /api/appointments/update` → update status (admin)

## DATABASE MODELS
Clinic → Doctor → Schedule
Clinic → Service
Clinic → Promotion
Doctor → Appointment

## PAGES (5)
| Route | Type | Desc |
|---|---|---|
| `/` | SSG | Landing — hero, layanan, dokter, promo, WA |
| `/booking` | CSR | Form booking online |
| `/admin` | SSR | List booking + update status |
| `/api/*` | SSR | JSON API |

## PERFORMANCE TARGETS
- First Load JS < 150KB
- Lighthouse > 90
- Booking submit < 500ms
- CDN cache landing page (static)
