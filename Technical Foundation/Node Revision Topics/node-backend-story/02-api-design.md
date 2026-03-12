# Part II — API Design & Data

[← Index](./00-index.md) | [← Core Flow](./01-core-flow.md)

---

### 11. Environment & Configuration

Secrets (API keys, DB passwords, JWT secret) and environment-specific config (dev vs prod) should never live in code. Use `.env` and load it at startup.

```javascript
require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,  // required in prod
  dbUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || "development",
};
```

---

### 12. API Versioning

When you change the API contract, existing clients may break. Version your API so old clients keep working while new ones use the latest.

```javascript
// Option A: URL prefix
app.use("/v1", v1Router);
app.use("/v2", v2Router);

// Option B: Header
// Clients send: Accept: application/vnd.api+json;version=2
```

#### REST vs GraphQL (when to choose which)

- **How you fetch data**
  - **REST**: many endpoints; server decides response shape per endpoint.
  - **GraphQL**: usually one endpoint; client selects fields (response shape is client-driven).

- **Payload efficiency**
  - **REST**: risk of over-fetching/under-fetching unless you add “include/fields” patterns.
  - **GraphQL**: clients request only what they need (but you must defend against expensive queries).

- **Caching**
  - **REST**: excellent HTTP/CDN caching with `GET`, `Cache-Control`, `ETag`, URL-based cache keys.
  - **GraphQL**: harder at HTTP layer (same URL, many query bodies); caching shifts to clients/persisted queries/custom layers.

- **Errors & observability**
  - **REST**: clear semantics via HTTP status codes (404/409/401/403) and simpler logs/metrics.
  - **GraphQL**: partial successes are common (`data` + `errors[]`); can complicate alerting and debugging if not standardized.

- **Security & performance controls**
  - **REST**: authz checks tend to be endpoint/resource-based (simpler mental model).
  - **GraphQL**: authz is often field/resolver-level; add depth/complexity limits, persisted queries, rate limits, and query allowlists.

**Why REST is often the default (and worth sticking with)**:
- **Operational simplicity**: fewer moving parts than schema + resolvers + query planning.
- **Predictable performance**: endpoints map cleanly to DB/query patterns; easier to protect hot paths.
- **Infrastructure wins**: plays naturally with proxies/CDNs and standard HTTP tooling.
- **Interoperability**: easiest for third-party integrations and common clients/tools.

**When GraphQL is a better fit**:
- Many distinct clients (web/mobile/partners) need **many different projections** of the same data graph, and REST is causing endpoint sprawl or too many round trips.

**REST patterns that cover many GraphQL benefits**:
- Sparse fieldsets (`?fields=id,name,avatar`)
- Includes/expansions (`?include=posts,company`)
- Purpose-built aggregation endpoints (or a BFF) for UI-specific needs

---

### 13. Pagination & Query Parameters

List endpoints (`GET /users`) need pagination so you don't return millions of rows. Validate query params with Zod.

```javascript
const ListQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort: z.enum(["createdAt", "name"]).default("createdAt"),
});

app.get("/users", (req, res) => {
  const { page, limit, sort } = ListQuerySchema.parse(req.query);
  const skip = (page - 1) * limit;
  const users = await prisma.user.findMany({
    skip,
    take: limit,
    orderBy: { [sort]: "desc" },
  });
  res.json({ data: users, page, limit });
});
```

---

### 14. Authorization (Who Can Do What)

Authentication = "Who are you?" (token valid). Authorization = "Are you allowed?" (permissions, roles). Check both: auth middleware confirms identity; then you check if that user can perform the action.

```javascript
const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

app.delete("/users/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  await userService.delete(Number(req.params.id));
  res.status(204).send();
});
```

---

[← Core Flow](./01-core-flow.md) | [Index](./00-index.md) | [Next: Security & Resilience →](./03-security-resilience.md)
