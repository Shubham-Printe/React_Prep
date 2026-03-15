# Spec — UPI Invoice + Payment Follow‑up (MVP)

## One-line pitch

Create a client-ready invoice in under 2 minutes, share a link/PDF, and follow up politely until it’s paid.

## Target user (MVP)

- Freelancers, consultants, small agencies in India
- They invoice 1–20 clients/month
- They often share invoices on email/WhatsApp and track payments manually

## Core outcome (must happen in < 5 minutes)

User can:
1) create an invoice
2) generate a shareable link + PDF
3) send a follow-up message template

## MVP features (must-have)

### Invoice creation
- Client name + optional email/phone
- Invoice line items (description, qty, rate)
- Total + due date
- Notes (optional)

### Branding (simple)
- Your name/business name
- Logo upload (optional)
- Primary color (optional)

### Payment instructions (India-first)
- UPI ID (e.g., `name@bank`)
- Optional: beneficiary name
- Show a UPI QR on invoice
  - QR encodes payee + amount (best effort)

### Invoice delivery
- Shareable invoice page: `/i/<publicId>`
- PDF download (from the invoice page)
- Status: `unpaid | paid`
- Manual “Mark as paid” (owner-only)

### Follow-up templates
- Copy buttons for:
  - Friendly reminder (before due)
  - Due today
  - Overdue (soft)
  - Overdue (firm)
- Templates include variables: client name, amount, due date, invoice link
- Initially: **copy-to-clipboard** only (no WhatsApp API)

## Nice-to-have (after first payout)

- Email sending inside app (Resend/Postmark)
- Automated reminder schedule
- Basic ledger export (CSV)
- Login/auth (Clerk/Supabase) + multi-device access
- Client “Pay now” button integration (Razorpay Payment Links / Checkout)

## Non-goals (for MVP)

- Full accounting/GST product
- Inventory, expenses, bank reconciliation
- Multi-currency, multi-entity
- Complex roles/teams
- Mobile apps

## Data model (draft)

- `User`
- `Client`
- `Invoice`
- `InvoiceItem`
- `BrandingSettings`

## Payment strategy for the MVP

### Principle (India-first)

Default to **free-to-start** so users can build trust and habit before paying.

### MVP plan: Freemium + “exceptional” 3‑months free offer

We’ll do both:
- **Freemium forever** (small users can stay free)
- An **exceptional offer**: *“3 months of Pro (or Growth) free”* for early adopters

This keeps friction low while still letting us learn what people will pay for.

### How we detect “reliance”

We consider a user “relying” on the product when usage is:
- **Frequent**: invoices created in last 30 days (e.g., 10+, 20+, 50+)
- **Consistent**: active usage across 8–12 weeks (habit formed)
- **Deep** (strong signals):
  - repeats PDF downloads
  - reuses saved clients / templates
  - uses follow-up templates regularly
  - comes back to track and mark invoices as paid

A simple trigger we can start with:
- **Reliant = 20+ invoices in the last 30 days AND active for 8+ weeks**

### Pricing model (recommended)

Avoid charging a % of invoice value in the beginning (it can feel like a “tax” and raises trust questions).

Prefer pricing based on **usage and features**:
- invoices/month limits
- clients count
- branding (logo/colors)
- exports (CSV)
- reminders/history
- team/multi-user

### Suggested tiers (names TBD)

**Free**
- Limited invoices/month (enough to form habit)
- Share link + PDF
- Basic follow-up templates

**Basic**
- Higher invoice limits
- Branding (logo + colors)
- Basic exports

**Growth** (intermediate)
- Much higher limits
- Templates, follow-up packs
- Ledger/export improvements

**Pro**
- Team features
- Advanced automations (scheduled reminders, integrations)

### How we monetize without losing users early

We don’t block core value. We:
- keep Free useful
- introduce gentle upgrade prompts at thresholds (invoice limit, exports, branding)
- offer **3 months free** as an “early adopter” incentive
- ask for payment only after reliance signals are strong (2–3 months of consistent usage)

### Payment implementation path

Phase 1 (fastest):
- For paid upgrades, start with a simple flow:
  - Razorpay payment link → manual upgrade (first 10–20 customers)

Phase 2:
- Integrate Razorpay/Cashfree in-app for automatic upgrades and invoices/receipts.

## Success metrics (first 30 days)

- 1–3 payments collected
- 1 payout settled to your bank account
- ≥ 20 demo conversations OR ≥ 50 targeted messages sent

