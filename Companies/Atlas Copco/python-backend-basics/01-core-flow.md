# Part I — The Core Flow

[← Index](./00-index.md)

Once you understand this flow, Python, Node, .NET are just different tools to build the same thing.

---

### 1. The Server

The server is the entry point. It listens on a port (e.g. 3000, 8000), accepts incoming HTTP requests, and passes them into the application. In Node it's Express or Fastify; in Python it's FastAPI, Flask, or Django running behind uvicorn/gunicorn. The server doesn't do the work — it hands requests off to the rest of the stack.

```python
# main.py
from fastapi import FastAPI

app = FastAPI()

# Run with: uvicorn main:app --reload --port 8000
# "main" = module, "app" = FastAPI instance
```

---

### 2. Routes

Routes map URL + HTTP method (GET, POST, PUT, DELETE) to a handler. When a request hits `/users/123` with GET, the router says: "this goes to the user-detail handler." Routes are thin — they don't contain business logic. They just connect requests to the right place.

```python
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    return user_service.get_by_id(user_id)

@app.post("/users")
async def create_user(user: UserCreate):
    return user_service.create(user)

@app.put("/users/{user_id}")
async def update_user(user_id: int, user: UserUpdate):
    return user_service.update(user_id, user)

@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    return user_service.delete(user_id)
```

---

### 3. Middleware

Before a request reaches the route handler, it may pass through middleware — functions that run for every request (or a subset). Middleware handles **cross-cutting concerns**:

- **Auth**: Is there a valid token? Is the user allowed?
- **Logging**: Log request method, path, duration
- **CORS**: Add headers so the browser allows the frontend origin
- **Data normalization**: Parse JSON body, set defaults, sanitize input

**What is CORS?** When your React app at `http://localhost:5173` calls your API at `http://localhost:8000`, the browser treats that as a *cross-origin* request (different port or domain). By default, the browser blocks these responses unless the API sends `Access-Control-Allow-Origin` with the frontend's origin. CORS (Cross-Origin Resource Sharing) middleware adds those headers so the browser allows the response. Without it, the request succeeds on the server but the browser blocks the response and the frontend gets a CORS error.

Middleware runs in order. If auth middleware rejects the request, the route handler never runs. Separation of concerns: routes decide *what* to do; middleware handles *how* we prepare and protect the request.

```python
from fastapi.middleware.cors import CORSMiddleware
import time

# CORS — allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging middleware (custom)
@app.middleware("http")
async def log_requests(request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    print(f"{request.method} {request.url.path} - {duration:.2f}s")
    return response
```

---

### 4. Protected Routes & Authentication

Some routes are public (`GET /health`); others require authentication. For protected routes, middleware (or a route-level guard) runs first: it checks for an auth token (JWT in header, session cookie, etc.), validates it, and either attaches user info to the request or returns 401 Unauthorized.

The auth **strategy** is decided once (JWT, OAuth, session-based) and reused across routes. The frontend sends the token; the backend validates it. Same idea in Node, Python, or .NET.

```python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    user = decode_and_validate_jwt(token)  # your JWT logic
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return user

# Protected route — Depends(get_current_user) runs first
@app.get("/me")
async def get_me(user = Depends(get_current_user)):
    return {"id": user.id, "email": user.email}
```

---

### 5. Schemas (Request / Response Validation)

Before touching business logic, we validate the request. Schemas define the shape of incoming data (body, query params) and outgoing responses. Invalid data → 400 or 422 before we do any work. In Node: Zod, Joi. In Python: Pydantic. Same job: validate early, fail fast.

```python
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

@app.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate):
    return user_service.create(user)
```

---

### 6. Controllers (Business Logic)

The controller (or service layer) is where the real work happens. It doesn't know about HTTP — it receives validated data, talks to the database, coordinates with external services, and returns results. Routes are thin; controllers are thick. We separate concerns so we can test and reuse logic without thinking about request/response.

```python
# services/user_service.py — no HTTP, just logic
class UserService:
    def __init__(self, db):
        self.db = db

    def get_by_id(self, user_id: int):
        return self.db.query(User).filter(User.id == user_id).first()

    def create(self, user_data: dict):
        user = User(**user_data)
        self.db.add(user)
        self.db.commit()
        return user

# main.py — route stays thin
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    return user_service.get_by_id(user_id)
```

---

### 7. Database & CRUD

Controllers interact with the database for create, read, update, delete. We use an ORM (Object-Relational Mapper) or a query builder so we don't write raw SQL everywhere. In Node: Prisma, TypeORM. In Python: SQLAlchemy, Django ORM. The patterns are the same: connect, query, map results to objects or JSON.

```python
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker

engine = create_engine("postgresql://user:pass@localhost/db")
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_user(db: Session, user_id: int):
    return db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()

def create_user(db: Session, user: UserCreate):
    db_user = User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
```

---

### 8. External Services & File Operations

Backends also talk to third-party APIs (payment, email, IoT protocols like Modbus/MQTT), read/write files, and handle background jobs. These are I/O-bound, so we use async handlers where the framework supports it. Same abstraction: call out, get response, return or store.

```python
import json
import httpx

async def fetch_weather(city: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://api.weather.com/{city}")
        return response.json()

def load_config(path: str) -> dict:
    with open(path) as f:
        return json.load(f)

# MQTT (industrial) — paho-mqtt
# client = mqtt.Client()
# client.connect("broker", 1883)
# client.publish("topic", payload)
```

---

### 9. Error Handling

We don't let raw exceptions bubble up. We catch them, map them to HTTP status codes (404 Not Found, 500 Internal Error), and return consistent JSON error responses. Some frameworks have global exception handlers; others use middleware. The goal: the frontend always gets a predictable shape, and we log details on the server.

```python
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    user = user_service.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc), "type": "validation_error"}
    )
```

---

### 10. Putting It Together

```
Request → Server → Middleware (CORS, auth, logging)
                         ↓
                   Route matches URL + method
                         ↓
                   Schema validates body/params
                         ↓
                   Controller runs business logic
                         ↓
                   Controller → DB / external services
                         ↓
                   Response (JSON) ← Error handler if something fails
```

```python
# Full example — main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_methods=["*"])

def get_db(): ...
async def get_current_user(credentials = Depends(security)): ...

@app.get("/users/{user_id}")
async def get_user(user_id: int, db = Depends(get_db), user = Depends(get_current_user)):
    result = user_service.get_by_id(db, user_id)
    if not result:
        raise HTTPException(404, "Not found")
    return result
```

---

[← Index](./00-index.md) | [Next: Python Syntax & Concepts →](./02-python-syntax-and-concepts.md)
