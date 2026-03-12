# Part III — Security & Resilience

[← Index](./00-index.md) | [← API Design](./02-api-design.md)

---

### 15. Rate Limiting

Protect your API from abuse: limit how many requests a client can make per minute. Return 429 Too Many Requests when exceeded.

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 100,             // 100 requests per minute
  message: { error: "Too many requests" },
});

app.use("/api", limiter);
```

---

### 16. Security Headers (Helmet)

Add security-related HTTP headers to reduce XSS, clickjacking, MIME-sniffing risks.

```javascript
const helmet = require("helmet");
app.use(helmet());
```

---

### 17. Input Sanitization

Never trust user input. Validate with Zod; sanitize strings (trim, escape) before storing or rendering. ORMs like Prisma use safe query building and prevent SQL injection.

```javascript
// Zod validates types; add transform for sanitization
const UserCreateSchema = z.object({
  name: z.string().min(1).max(100).transform((s) => s.trim()),
  email: z.string().email().transform((s) => s.toLowerCase()),
});
```

---

[← API Design](./02-api-design.md) | [Index](./00-index.md) | [Next: Observability & Ops →](./04-observability-ops.md)
