# User Flow & Wireframe — Klinik Gigi Sehatin

## USER FLOW

### Tipe 1 & 2 (Booking → WA)
```
[Landing] → Liat layanan/dokter/promo
          → Klik "Booking via WhatsApp"
          → WA terkirim ke klinik
          → Owner balas manual
```

### Tipe 3 (Booking Online)
```
[Landing] → Liat layanan/dokter/promo
          → Klik "Booking Online"
          → Pilih layanan
          → Pilih dokter
          → Pilih tanggal
          → Pilih jam
          → Isi nama/WA/keluhan
          → Submit
          → [Admin] lihat booking
          → Admin ubah status (pending→confirmed→done)
```

## WIREFRAME (5 halaman)

### 1. Landing Page
```
┌─────────────────────────────────────────┐
│  [HERO]                                  │
│  Klinik Gigi Sehatin                     │
│  cta: [Booking WA] [Booking Online]      │
├─────────────────────────────────────────┤
│  LAYANAN (grid 3 kolom)                  │
│  ┌──────┐ ┌──────┐ ┌──────┐            │
│  │Scaling│ │Tambal│ │Cabut │            │
│  │Rp150K │ │Rp200K│ │Rp250K│            │
│  └──────┘ └──────┘ └──────┘            │
├─────────────────────────────────────────┤
│  DOKTER (grid 3 kolom)                   │
│  avatar + nama + spesialis               │
├─────────────────────────────────────────┤
│  PROMO (border amber)                    │
│  Scaling gratis beli 2                   │
├─────────────────────────────────────────┤
│  BOOKING                                  │
│  [Booking WA] [Booking Online]           │
├─────────────────────────────────────────┤
│  FOOTER — kontak, alamat, jam            │
└─────────────────────────────────────────┘
```

### 2. Booking Page
```
┌─────────────────────────────────────────┐
│  ← Beranda                               │
│                                          │
│  Layanan: [Dropdown]                     │
│  Dokter:  [Dropdown]                     │
│  Tanggal: [Input date]                   │
│  Jam:     [08:00] [09:00] [10:00] ...    │
│  Nama:    [Input]                        │
│  WA:      [Input]                        │
│  Keluhan: [Textarea]                     │
│  [Booking Sekarang]                      │
└─────────────────────────────────────────┘
```

### 3. Admin Page
```
┌─────────────────────────────────────────┐
│  Admin — Booking                         │
│  Pending: 3  Confirmed: 5  Done: 12      │
│                                          │
│  ┌─ Booking Card ──────────────────────┐ │
│  │ Pasien: Budi                    ⏳ pending│
│  │ Dokter: drg Andi · Scaling       [▼ ubah status]│
│  │ 12 Apr 2025 jam 09:00            │ │
│  └────────────────────────────────────┘ │
│  ┌─ Booking Card ──────────────────────┐ │
│  │ ...                                  │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 4. Konfirmasi (after booking)
```
┌─────────────────────────────────────────┐
│           ✓ Booking Berhasil!            │
│  Kami akan konfirmasi via WhatsApp.      │
│              [Kembali]                    │
└─────────────────────────────────────────┘
```
