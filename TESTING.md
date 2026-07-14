# Testing & QA Checklist — Klinik Gigi Sehatin

## 1. MANUAL TESTING

### Landing Page
- [ ] Hero section appears + CTA buttons clickable
- [ ] Services grid loads (check all 8 services)
- [ ] Doctors section shows names + specialties
- [ ] Promotions display if active
- [ ] "Booking via WhatsApp" opens WA with pre-filled message
- [ ] "Booking Online" navigates to /booking
- [ ] Contact section shows address, hours, email, phone

### Booking Page
- [ ] Service dropdown populates correctly
- [ ] Doctor dropdown populates correctly
- [ ] Date picker works (min = tomorrow)
- [ ] Time slots appear only after doctor + date selected
- [ ] "No schedule" message when doctor unavailable that day
- [ ] Form submit with empty required fields → disabled
- [ ] Submit valid form → success screen
- [ ] Success screen shows
- [ ] Booking saved to database (check admin page)

### Admin Page
- [ ] All bookings listed (newest first)
- [ ] Status badges show correct color
- [ ] Status dropdown changes on select
- [ ] Counter updates after status change
- [ ] Refresh — status persists

### Responsive
- [ ] Landing — mobile (<640px), tablet, desktop
- [ ] Booking — mobile layout stacks vertically
- [ ] Admin — horizontal scroll? or wrap

### Performance
- [ ] First Load JS < 150KB
- [ ] Pages load < 2s (3G simulated)

## 2. EDGE CASES
- [ ] Book for same doctor + same time slot → allowed? (no conflict detection yet)
- [ ] Empty clinic data → API returns 404
- [ ] Invalid date (past) → date input prevents it
- [ ] Long patient name (100+ chars)
- [ ] Special chars in notes (XSS?) → Next.js escapes by default

## 3. AUTOMATION (ponytail)
Skipped. Add Playwright e2e when project grows past 5 pages.
