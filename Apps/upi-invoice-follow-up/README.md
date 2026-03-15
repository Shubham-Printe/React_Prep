# UPI Invoice + Follow-up (App)

Docs and planning live in `docs/01-upi-invoice-follow-up/` and `docs/`.

This folder contains the implementation.

## Standards

See `AGENTS.md`.

Note: Cursor rules live in `.cursor/rules/` at the workspace root (Cursor only auto-loads rules from that location). Our app-specific rules are scoped via globs to `Apps/upi-invoice-follow-up/**`.

## Dev

From `backend/`:

- `npm run dev` (starts API server on `:4000`)
- `npm run test`
- `npm run build`
- `npm start`

## Architecture

- **Backend** lives in `backend/` and is deployed separately.
- **Frontend** will live in `frontend/` (to be added) and will call the backend via HTTP API endpoints.

