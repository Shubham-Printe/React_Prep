# Python Backend Basics — How a Backend System Works
*Your path to full-stack: FastAPI, Pydantic, SQLAlchemy. Same concepts as Node—different tools.*

---

## Overview

This guide walks through the essential parts of a backend: from the server that receives requests to routes, middleware, controllers, and databases. Once you understand this flow, Python, Node, and .NET are just different tools to build the same thing. This doc focuses on the Python stack: FastAPI, Pydantic, uvicorn.

---

## Contents

| # | File | Topics |
|---|------|--------|
| 1 | [01-core-flow.md](./01-core-flow.md) | Server, routes, middleware, auth, schemas, controllers, DB, external services, error handling |
| 2 | [02-python-syntax-and-concepts.md](./02-python-syntax-and-concepts.md) | Syntax, decorators, type hints, async, venv |
| 3 | [03-react-and-interview.md](./03-react-and-interview.md) | How React fits in, interview positioning, next steps |

---

## The Full Picture

```
                    ┌─────────────────────────────────────────────────────┐
                    │                   REQUEST LIFECYCLE                  │
                    └─────────────────────────────────────────────────────┘
Request
  │
  ▼
┌─────────────────┐
│ CORS            │  CORSMiddleware
└────────┬────────┘
         ▼
┌─────────────────┐
│ Route match     │  @app.get("/users/{id}")
└────────┬────────┘
         ▼
┌─────────────────┐
│ Depends(auth)   │  get_current_user — JWT validation
└────────┬────────┘
         ▼
┌─────────────────┐
│ Pydantic        │  Validates body, path params, query
└────────┬────────┘
         ▼
┌─────────────────┐
│ Controller      │  Service layer (business logic)
│  ├─ DB          │  SQLAlchemy, Django ORM
│  └─ External API│  httpx, files, MQTT
└────────┬────────┘
         ▼
┌─────────────────┐
│ Response        │  JSON (dict → auto-serialized)
└────────┬────────┘
         ▼
┌─────────────────┐
│ Error handler   │  HTTPException, exception_handler
└─────────────────┘
```

---

## Python Backend Vocabulary

| Term | What it is |
|------|------------|
| **FastAPI** | Modern async web framework. Decorator routes, Pydantic, OpenAPI docs auto-generated. |
| **Pydantic** | Data validation. Defines schemas with type hints. `BaseModel`, `EmailStr`. Like Zod in JS. |
| **uvicorn** | ASGI server. Runs FastAPI: `uvicorn main:app --reload`. Like nodemon for Node. |
| **ASGI** | Async Server Gateway Interface. Modern Python async standard. FastAPI uses it. |
| **WSGI** | Older sync standard. Flask, Django. One request at a time per worker. |
| **pip** | Package manager. `pip install fastapi uvicorn`. Like npm. |
| **venv** | Isolated Python environment per project. `source venv/bin/activate` before work. |
| **requirements.txt** | Lists dependencies. `pip install -r requirements.txt`. Like package.json deps. |
| **Decorator** | `@app.get("/")` — wraps a function. Used for routes, middleware. Same idea as Express route handlers. |
| **Type hints** | `def foo(x: int) -> dict:` — optional typing. Pydantic and tools use them for validation. |
| **HTTPException** | FastAPI's way to return errors. `raise HTTPException(status_code=404, detail="Not found")`. |
| **Depends()** | Dependency injection. Reusable logic (auth, DB session) injected into route handlers. |
| **Flask-Login** / **python-jose** | Auth helpers. JWT handling, session management. |

*If you know Express + Zod + Passport, think: Pydantic + FastAPI + Depends.*

---

## Python Web Frameworks (Backend)

| Framework | Best for | Stack |
|-----------|----------|-------|
| **FastAPI** | Modern async APIs | Pydantic, OpenAPI (Swagger), uvicorn. Type hints → auto validation + docs. |
| **Flask** | Lightweight, flexible | WSGI. Add flask-cors, marshmallow (validation). Micro framework. |
| **Django** | Full apps, admin, ORM | Django REST Framework (DRF) for APIs. Batteries-included. |

*For UI/HMI and embedded: FastAPI or Flask are common. React calls their endpoints like any REST API.*

---

## Summary — 10 Essential Parts (Core Flow)

| # | Concept |
|---|---------|
| 1 | Server — FastAPI app, uvicorn listens |
| 2 | Routes — `@app.get`, `@app.post`, path params |
| 3 | Middleware — CORS, logging, order matters |
| 4 | Protected routes — `Depends(get_current_user)`, JWT |
| 5 | Schemas — Pydantic `BaseModel`, validate early |
| 6 | Controllers — Service layer, no HTTP logic |
| 7 | Database — SQLAlchemy, Django ORM, CRUD |
| 8 | External services — httpx, files, MQTT |
| 9 | Error handling — `HTTPException`, `exception_handler` |
| 10 | Putting it together — full request flow |

---

## Cross-Reference

- **Node equivalent**: `Technical Foundation/Node Revision Topics/node-backend-story/` — same concepts, Express/Zod/Prisma examples. Includes env, rate limiting, caching, jobs.
- **React integration**: `04-apis-integration.md` — how React calls these APIs.
