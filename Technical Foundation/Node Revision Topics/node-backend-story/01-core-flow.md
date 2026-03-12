# Part I — The Core Flow

[← Index](./00-index.md)

---

### 1. The Server

The server is the entry point. It listens on a port (e.g. 3000, 8000), accepts incoming HTTP requests, and passes them into the application. In Node it's Express or Fastify; in Python it's FastAPI, Flask, or Django. The server doesn't do the work — it hands requests off to the rest of the stack.

```javascript
// server.js or index.js
const express = require("express");

const app = express();

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

// Or with ES modules:
// import express from "express";
// const app = express();
// app.listen(3000);
```

---

### 2. Routes

Routes map URL + HTTP method (GET, POST, PUT, DELETE) to a handler. When a request hits `/users/123` with GET, the router says: "this goes to the user-detail handler." Routes are thin — they don't contain business logic. They just connect requests to the right place.

```javascript
app.get("/users/:user_id", (req, res) => {
  const user = userService.getById(Number(req.params.user_id));
  res.json(user);
});

app.post("/users", (req, res) => {
  const user = userService.create(req.body);
  res.status(201).json(user);
});

app.put("/users/:user_id", (req, res) => {
  const user = userService.update(Number(req.params.user_id), req.body);
  res.json(user);
});

app.delete("/users/:user_id", (req, res) => {
  userService.delete(Number(req.params.user_id));
  res.status(204).send();
});
```

---

### 3. Middleware

Before a request reaches the route handler, it may pass through middleware — functions that run for every request (or a subset). Middleware handles **cross-cutting concerns**:

- **Auth**: Is there a valid token? Is the user allowed?
- **Logging**: Log request method, path, duration
- **CORS**: Add headers so the browser allows the frontend origin
- **Data normalization**: Parse JSON body, set defaults, sanitize input

**What is CORS?** When your React app at `http://localhost:5173` calls your API at `http://localhost:3000`, the browser treats that as a *cross-origin* request (different port or domain). By default, the browser blocks these responses unless the API sends `Access-Control-Allow-Origin` with the frontend's origin. CORS (Cross-Origin Resource Sharing) middleware adds those headers so the browser allows the response. Without it, fetch/axios succeeds on the server but the browser blocks the response and the frontend gets a CORS error.

Middleware runs in order. If auth middleware rejects the request, the route handler never runs. Separation of concerns: routes decide *what* to do; middleware handles *how* we prepare and protect the request.

```javascript
const cors = require("cors");

// CORS — allow React frontend
app.use(cors({ origin: "http://localhost:3000" }));

// Parse JSON body
app.use(express.json());

// Logging middleware (custom)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.path} - ${Date.now() - start}ms`);
  });
  next();
});
```

---

### 4. Protected Routes & Authentication

Some routes are public (`GET /health`); others require authentication. For protected routes, middleware (or a route-level guard) runs first: it checks for an auth token (JWT in header, session cookie, etc.), validates it, and either attaches user info to the request or returns 401 Unauthorized.

The auth **strategy** is decided once (JWT, OAuth, session-based) and reused across routes. The frontend sends the token; the backend validates it. Same idea in Node, Python, or .NET.

```javascript
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Protected route — authMiddleware runs first
app.get("/me", authMiddleware, (req, res) => {
  res.json({ id: req.user.id, email: req.user.email });
});
```

---

### 5. Schemas (Request / Response Validation)

Before touching business logic, we validate the request. Schemas define the shape of incoming data (body, query params) and outgoing responses. Invalid data → 400 or 422 before we do any work. In Node: Zod, Joi. In Python: Pydantic. In .NET: Data Annotations, FluentValidation. Same job: validate early, fail fast.

```javascript
const { z } = require("zod");

const UserCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

app.post("/users", (req, res) => {
  const parsed = UserCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ errors: parsed.error.flatten() });
  }
  const user = userService.create(parsed.data);
  res.status(201).json(user);
});
```

---

### 6. Controllers (Business Logic)

The controller (or service layer) is where the real work happens. It doesn't know about HTTP — it receives validated data, talks to the database, coordinates with external services, and returns results. Routes are thin; controllers are thick. We separate concerns so we can test and reuse logic without thinking about request/response.

```javascript
// services/userService.js — no HTTP, just logic
class UserService {
  constructor(db) {
    this.db = db;
  }

  getById(userId) {
    return this.db.user.findUnique({ where: { id: userId } });
  }

  create(data) {
    return this.db.user.create({ data });
  }
}

// Routes stay thin
const userService = new UserService(prisma);

app.get("/users/:user_id", async (req, res) => {
  const user = await userService.getById(Number(req.params.user_id));
  res.json(user);
});
```

---

### 7. Database & CRUD

Controllers interact with the database for create, read, update, delete. We use an ORM (Object-Relational Mapper) or a query builder so we don't write raw SQL everywhere. In Node: Prisma, TypeORM. In Python: SQLAlchemy, Django ORM. The patterns are the same: connect, query, map results to objects or JSON.

**What is an ORM?** An ORM maps your database to objects in code: tables → classes, rows → instances, columns → properties, relations → references. Instead of raw SQL (`SELECT * FROM users WHERE id = 1`), you call `prisma.user.findUnique({ where: { id: 1 } })`. Benefits: abstraction (work in your language, not SQL), type safety (Prisma generates TypeScript types from your schema), migrations (versioned schema changes), and built-in protection against SQL injection. When you see `prisma.user.findMany()`, that's the ORM hiding the SQL and returning plain objects.

```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CRUD with Prisma
async function getUser(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}

async function createUser(data) {
  return prisma.user.create({
    data: { name: data.name, email: data.email },
  });
}

async function updateUser(userId, data) {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

async function deleteUser(userId) {
  return prisma.user.delete({
    where: { id: userId },
  });
}
```

---

### 8. External Services & File Operations

Backends also talk to third-party APIs (payment, email, IoT protocols like Modbus/MQTT), read/write files, and handle background jobs. These are I/O-bound, so we use async handlers. Same abstraction: call out, get response, return or store.

```javascript
const fs = require("fs").promises;

// Call external API (fetch is built-in in Node 18+)
async function fetchWeather(city) {
  const res = await fetch(`https://api.weather.com/${city}`);
  return res.json();
}

// File read/write
async function loadConfig(path) {
  const data = await fs.readFile(path, "utf-8");
  return JSON.parse(data);
}

// MQTT (industrial) — library like mqtt
// const mqtt = require("mqtt");
// const client = mqtt.connect("mqtt://broker");
// client.publish("topic", payload);
```

---

### 9. Error Handling

We don't let raw exceptions bubble up. We catch them, map them to HTTP status codes (404 Not Found, 500 Internal Error), and return consistent JSON error responses. Some frameworks have global error handlers; others use middleware. The goal: the frontend always gets a predictable shape, and we log details on the server.

```javascript
// Explicit in handler
app.get("/users/:user_id", async (req, res) => {
  const user = await userService.getById(Number(req.params.user_id));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500).json({
    error: err.message ?? "Internal server error",
    type: err.name,
  });
});
```

---

### 10. Putting It Together

```
Request → Server → Middleware (CORS, json, auth, logging)
                         ↓
                   Route matches URL + method
                         ↓
                   Schema validates body/params (Zod)
                         ↓
                   Controller runs business logic
                         ↓
                   Controller → DB / external services
                         ↓
                   Response (JSON) ← Error handler if something fails
```

This is the same whether you build it in Node, Python, or .NET. The concepts—server, routes, middleware, controllers, schemas, error handling—are universal. The language and frameworks are tools.

```javascript
// Full example — app.js
const express = require("express");
const cors = require("cors");
const { authMiddleware } = require("./middleware/auth");

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/users/:user_id", authMiddleware, async (req, res) => {
  const user = await userService.getById(Number(req.params.user_id));
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
});

app.listen(3000);
```

---

[← Index](./00-index.md) | [Next: API Design & Data →](./02-api-design.md)
