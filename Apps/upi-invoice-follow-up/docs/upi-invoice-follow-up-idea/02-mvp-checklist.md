# MVP Checklist (7–10 days) — UPI Invoice + Follow‑up

This is intentionally biased toward: **ship fast → collect first payment → improve**.

## Cost rule (non-negotiable)

**We pay only when we get paid.** Until there’s revenue, we avoid fixed monthly costs and choose approaches that are:
- free tier / pay-as-you-go
- low infrastructure
- manual where needed for first users

### Cost hotspots (what can accidentally cost money)
- **PDF generation** (if you render PDFs on the server)
- **Email/SMS/WhatsApp sending** (automations and message APIs)
- **File storage** (logos, stored PDFs) + bandwidth
- **Database size/traffic** at scale (usually free initially)
- **Payment fees** (only when you actually charge customers)

---

## Day 1: Decide scope + setup

- [ ] Confirm MVP scope = invoice + share link + PDF + follow-up templates (no paid gates yet)
- [ ] Pick stack (suggested):
  - Next.js + Tailwind
  - Supabase (DB + auth later if needed)
  - Vercel deployment
- [ ] Create a simple landing page with:
  - problem + promise
  - screenshots placeholder
  - CTA: “Start free”
  - Optional: “3 months Pro free (early adopter offer)”

**Cost notes**
- Hosting can be **₹0** initially (Vercel/Supabase free tiers).
- Domain is a small fixed cost (optional on day 1; you can start on a free subdomain).

---

## Day 2–3: Invoice builder UI

- [ ] Client form + items table (add/remove rows)
- [ ] Auto-calc totals
- [ ] Preview invoice component (print-friendly)
- [ ] Save invoice draft in DB (or local first, DB next)

**Cost notes**
- UI work is **₹0**.
- DB is typically **₹0** at low usage (free tier). Keep invoice payload small.

---

## Day 4: Share link + public invoice page

- [ ] Create `publicId` for invoice
- [ ] Public invoice route (no auth required)
- [ ] Make it look trustworthy: clean layout, totals, due date

**Cost notes**
- Main costs are bandwidth + DB reads, usually **₹0** on free tiers early.

---

## Day 5: PDF export

- [ ] PDF download button
- [ ] Ensure PDF matches preview and is readable on mobile

**Cost notes (choose the free option first)**
- Start with **client-side** PDF (print-to-PDF / browser-based generation): **₹0** server cost.
- Avoid server-side headless rendering (Playwright/Puppeteer) until you have revenue (it consumes compute).
- Don’t store PDFs initially (storage + bandwidth). Generate on demand.

---

## Day 6: UPI QR + payment instructions

- [ ] Save UPI ID in settings
- [ ] Generate UPI QR on invoice (payee + amount best-effort)
- [ ] Show fallback: UPI ID + amount + “Scan to pay”

**Cost notes**
- QR generation is **₹0** (it’s just an image generated from text).
- Avoid paid “dynamic QR” providers for MVP.

---

## Day 7: Follow-up templates + paid status

- [ ] Template library + variable substitution
- [ ] Copy-to-clipboard buttons
- [ ] Invoice status: unpaid/paid
- [ ] Owner-only “Mark paid” (basic protection)

**Cost notes (keep it free)**
- Copy-to-clipboard templates are **₹0**.
- Do **not** send WhatsApp/SMS/email automatically in MVP (message APIs cost money).

---

## Day 8: First monetization wiring (fast path)

- [ ] Keep core product free; set up optional paid upgrade path (for later)
- [ ] Create a Razorpay payment link (for upgrades) and keep it “hidden” until you need it
- [ ] Define what paid unlocks (examples):
  - higher invoice limits
  - branding (logo/colors)
  - exports (CSV)
  - advanced templates
- [ ] Manual upgrade process for first customers:
  - When payment arrives → manually unlock in DB/admin
  - Track in a simple sheet: name, email, payment date, tier

**Cost notes**
- Payment gateway fees happen **only when you charge** (good: “pay only when paid”).
- Avoid monthly paid billing tools until you have paying users.

---

## Day 9–10: Launch + outreach sprint

- [ ] Create a list of 50 freelancers/agencies (LinkedIn + communities)
- [ ] Send 10–20 messages/day with:
  - 1-line value prop
  - 15-sec demo link (screen recording)
  - free-to-start + “3 months Pro free” offer
- [ ] Take notes on objections; fix only what blocks onboarding/payment

**Cost notes**
- Outreach is **₹0**.
- Screen recording can be **₹0** (built-in tools / free plans).

---

## Definition of “done” (first payout)

- [ ] Product is usable end-to-end (invoice → share → PDF → follow-up copy)
- [ ] 10+ real users tried it (from outreach)
- [ ] 1 payment captured (optional upgrade, after trust is built)
- [ ] Customer successfully generated an invoice
- [ ] Payout settled to your bank (Razorpay/Cashfree settlement)

