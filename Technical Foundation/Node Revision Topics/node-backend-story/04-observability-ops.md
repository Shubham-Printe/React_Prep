# Part IV — Observability & Operations

[← Index](./00-index.md) | [← Security](./03-security-resilience.md)

---

### 18. Structured Logging

Use structured logs (JSON) with levels (info, warn, error) and a request ID so you can trace a request across services.

```javascript
const { v4: uuidv4 } = require("uuid");

app.use((req, res, next) => {
  req.id = req.headers["x-request-id"] || uuidv4();
  res.setHeader("x-request-id", req.id);
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(JSON.stringify({
      requestId: req.id,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: Date.now() - start,
    }));
  });
  next();
});
```

---

### 19. Health Checks

Load balancers and container orchestrators (Docker, Kubernetes) ping health endpoints to see if the app is alive. `/health` = process running; `/ready` = app can accept traffic (DB connected, etc.).

```javascript
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

app.get("/ready", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ ready: true });
  } catch {
    res.status(503).json({ ready: false });
  }
});
```

---

### 20. Graceful Shutdown

When the process receives SIGTERM (e.g. during deploy), stop accepting new requests, finish in-flight ones, close DB connections, then exit.

```javascript
const server = app.listen(3000);

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => console.log("HTTP server closed"));
  await prisma.$disconnect();
  process.exit(0);
});
```

---

[← Security](./03-security-resilience.md) | [Index](./00-index.md) | [Next: Advanced →](./05-advanced.md)
