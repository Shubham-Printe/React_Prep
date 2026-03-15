# Engineering Standards — UPI Invoice + Follow-up

This file is the source of truth for how we build the app.

## Non-negotiables

- **We pay only when we get paid**: avoid fixed monthly costs until revenue exists.
- **TypeScript-first**: strict types, minimal `any`.
- **Test core features**: unit + integration + e2e for the primary workflow.
- **Security by default**: no secrets in git, validate inputs, least privilege.
- **Ship in slices**: each PR/change should produce a usable increment.

## Project shape (target)

```
Apps/upi-invoice-follow-up/
  README.md
  AGENTS.md
  backend/
    package.json
    src/
      app.ts
      server.ts
      errors/
      http/
      routes/
      modules/
      config/
      lib/
      types/
  frontend/
    package.json
    src/
      components/
      features/
      lib/
      types/
  shared/
    src/
      schemas/
      types/
```

## Tooling baseline

- **Node**: we should standardize on **Node 20 LTS** long-term (cleaner security posture + modern deps).
- Current scaffold is kept **Node 18 compatible** to match your machine today.

## Naming conventions

- **Folders/files**: `kebab-case`
- **React components**: `PascalCase.tsx`
- **Hooks**: `useX.ts`
- **Functions/variables**: `camelCase`
- **Types/interfaces**: `PascalCase`
- **Booleans**: `is/has/can/should` prefixes

## Code conventions

- Prefer **pure functions** for business logic; keep IO at the edges.
- No DB calls in UI; UI calls server layer.
- Centralize limits and tier rules in `src/config/` (no scattered constants).
- Validate and normalize all user input on the server boundary.
- Errors must be actionable (message + context). Never swallow exceptions silently.

## “Pay only when paid” implementation guidance

Default choices until revenue:
- **Deploy** on free tiers (frontend: Vercel/Netlify, backend: Render/Fly/Railway free tier, DB: free tier).
- **PDF**: client-side export first; don’t store PDFs.
- **Messaging**: copy-to-clipboard templates only (no WhatsApp/SMS APIs).
- **Storage**: keep minimal assets; avoid large file uploads.
- **Analytics**: start with free-tier privacy-friendly analytics later (optional).

If a new feature adds cost, we must:
- quantify it (what triggers cost: per request, per user, per month)
- add a guardrail (limits, caching, paid tier, or “bring your own key”)

## Testing standards (minimum)

Core MVP requires tests for:
- invoice totals math
- public invoice link access rules
- follow-up template rendering
- UPI payload/QR generation
- “create invoice → view public link” e2e path

## Docs we maintain as we build

- `README.md`: setup + run + test
- `docs/adr/`: architecture decisions (short)
- `docs/runbook.md`: how to debug common production issues

