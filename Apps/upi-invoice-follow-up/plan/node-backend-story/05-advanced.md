# Part V — Advanced Capabilities

[← Index](./00-index.md) | [← Observability](./04-observability-ops.md)

---

### 21. Caching

Cache expensive or frequently read data (e.g. user profile, config) to reduce DB load. Use Redis for shared cache across instances.

```javascript
const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

async function getCachedUser(userId) {
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  await redis.setex(`user:${userId}`, 300, JSON.stringify(user)); // 5 min TTL
  return user;
}
```

---

### 22. Background Jobs

Some work (send email, process upload, generate report) shouldn't block the HTTP response. Push a job to a queue (Redis-based Bull/BullMQ); a worker processes it asynchronously.

```javascript
const Queue = require("bull");
const emailQueue = new Queue("email", process.env.REDIS_URL);

// In your route — enqueue, return immediately
app.post("/signup", async (req, res) => {
  const user = await userService.create(req.body);
  await emailQueue.add("welcome", { userId: user.id });
  res.status(201).json(user);
});

// Worker (separate process)
emailQueue.process("welcome", async (job) => {
  await sendWelcomeEmail(job.data.userId);
});
```

---

### 23. File Uploads

Handle multipart form data for file uploads. Validate file type and size; store on disk or cloud (S3).

```javascript
const multer = require("multer");
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Images only"));
    }
    cb(null, true);
  },
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ path: req.file.path });
});
```

---

### 24. Database Migrations

Schema changes (new column, new table) are managed as migrations—versioned files that upgrade the DB. Prisma: `prisma migrate dev`; TypeORM: migration files.

```bash
# Prisma
npx prisma migrate dev --name add_user_role

# Creates a migration file; applies it to DB
```

---

[← Observability](./04-observability-ops.md) | [Index](./00-index.md)
