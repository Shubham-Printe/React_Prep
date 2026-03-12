# Node Backend Story — How a Modern Backend System Works
*Your path to full-stack: Express/Fastify, Zod, Prisma. A guide to the essential parts of a production-ready backend.*

---

## Overview

This guide walks through every essential part of a modern backend: from the server that receives requests to background jobs, security, and deployment concerns. Once you understand this, Node, Python, .NET are just different tools to build the same thing.

---

## Contents

| # | File | Topics |
|---|------|--------|
| 1 | [01-core-flow.md](./01-core-flow.md) | Server, routes, middleware, auth, schemas, controllers, DB, external services, error handling |
| 2 | [02-api-design.md](./02-api-design.md) | Environment, API versioning, REST vs GraphQL trade-offs, pagination, authorization |
| 3 | [03-security-resilience.md](./03-security-resilience.md) | Rate limiting, helmet, input sanitization |
| 4 | [04-observability-ops.md](./04-observability-ops.md) | Logging, health checks, graceful shutdown |
| 5 | [05-advanced.md](./05-advanced.md) | Caching, background jobs, file uploads, migrations |

---

## The Full Picture

```
                    ┌─────────────────────────────────────────────────────┐
                    │                   REQUEST LIFECYCLE                 │
                    └─────────────────────────────────────────────────────┘
Request
  │
  ▼
┌─────────────────┐
│ Rate Limit      │  Part III
└────────┬────────┘
         ▼
┌─────────────────┐
│ CORS, Helmet    │  Part I (Middleware)
└────────┬────────┘
         ▼
┌─────────────────┐
│ express.json()  │  Parse body
└────────┬────────┘
         ▼
┌─────────────────┐
│ Request ID      │  Part IV (Logging)
└────────┬────────┘
         ▼
┌─────────────────┐
│ Route match     │  Part I (Routes)
└────────┬────────┘
         ▼
┌─────────────────┐
│ Auth middleware │  Part I (Protected routes)
└────────┬────────┘
         ▼
┌─────────────────┐
│ Schema validate │  Part I (Zod)
└────────┬────────┘
         ▼
┌─────────────────┐
│ Controller      │  Part I (Service layer)
│  ├─ Cache?      │  Part V
│  ├─ DB          │  Part I
│  ├─ Queue job?  │  Part V
│  └─ External API│  Part I
└────────┬────────┘
         ▼
┌─────────────────┐
│ Response        │  JSON + status
└────────┬────────┘
         ▼
┌─────────────────┐
│ Error handler   │  Part I (if something failed)
└─────────────────┘
```

---

## Node Backend Vocabulary

| Term | What it is |
|------|------------|
| **Express** | Minimal web framework. `app.get`, `app.post`, `app.use` middleware. |
| **Fastify** | Faster alternative. Schema-based validation, async-first. |
| **Zod** | Schema validation. `z.object()`, `safeParse()`. Like Pydantic in Python. |
| **Prisma** | Modern ORM. Type-safe, migrations, `prisma.user.findMany()`. |
| **TypeORM** | Alternative ORM. Class-based models, decorators. |
| **jsonwebtoken (jwt)** | JWT sign/verify. `jwt.verify(token, secret)`. |
| **cors** | CORS middleware. `app.use(cors({ origin: "..." }))`. |
| **express.json()** | Parses `application/json` body into `req.body`. |
| **next()** | Pass control to the next middleware/handler. |
| **dotenv** | Loads `.env` into `process.env`. Never commit `.env` to git. |
| **express-rate-limit** | Rate limiting middleware. Returns 429 when exceeded. |
| **helmet** | Security headers (XSS, clickjacking, etc.). `app.use(helmet())`. |
| **Bull / BullMQ** | Redis-based job queue. Enqueue jobs; workers process async. |
| **Redis** | In-memory store. Caching, sessions, job queues. |
| **multer** | Multipart form parser for file uploads. |
| **SIGTERM** | Signal sent when process should shut down. Handle for graceful exit. |

---

## Summary — 24 Essential Parts

| #  | Part        | Concept                                                                                       |
|----|-------------|-----------------------------------------------------------------------------------------------|
| 1–10 | Core flow | Server, routes, middleware, auth, schemas, controllers, DB, external services, error handling |
| 11 | Config      | Environment variables, .env |
| 12 | API design  | Versioning (/v1, /v2) |
| 13 | API design  | Pagination, query param validation |
| 14 | Security    | Authorization (roles, permissions) |
| 15 | Security    | Rate limiting |
| 16 | Security    | Helmet (security headers) |
| 17 | Security    | Input sanitization |
| 18 | Ops         | Structured logging, request ID |
| 19 | Ops         | Health checks (/health, /ready) |
| 20 | Ops         | Graceful shutdown |
| 21 | Advanced    | Caching (Redis) |
| 22 | Advanced    | Background jobs (Bull) |
| 23 | Advanced    | File uploads (multer) |
| 24 | Advanced    | Database migrations |

---
