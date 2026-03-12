# Part II — Python Syntax & Key Concepts

[← Index](./00-index.md) | [← Core Flow](./01-core-flow.md)

---

### Syntax Overview

Python backend APIs use decorators for routes, type hints for validation, and Pydantic for request/response schemas. This section covers the essential syntax and concepts you need to read and write FastAPI code.

---

### Core API Syntax

Path parameters, request bodies, and error handling — the basics of a FastAPI route:

```python
from fastapi import FastAPI, HTTPException

app = FastAPI()

# Path parameter — React calls GET /users/1
@app.get("/users/{user_id}")
async def read_user(user_id: int):
    return {"id": user_id, "name": "Admin"}

# Request body — Pydantic validates; invalid → 422
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str

@app.post("/users")
async def create_user(user: UserCreate):
    return {"created": user.name}

# Error handling
@app.get("/items/{item_id}")
async def get_item(item_id: int):
    item = fetch_from_db(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item
```

---

### Decorators

`@app.get("/")` is a decorator — a function that wraps another function. It registers the handler as a route. Same idea as Express route handlers: you declare the path and method, and the framework calls your function when a matching request arrives.

```python
@app.get("/users")
async def list_users():
    return [{"id": 1}, {"id": 2}]
```

---

### Type Hints and Pydantic

Type hints (`user_id: int`, `-> dict`) tell Python and tools what types to expect. Pydantic uses them for validation: invalid input → 422 before your handler runs. FastAPI also uses them to auto-generate OpenAPI (Swagger) docs.

```python
class Item(BaseModel):
    name: str
    price: float
```

---

### Async / asyncio

`async def` + `await` for I/O-bound work (DB, HTTP calls). FastAPI is async-first, so your handlers can await without blocking other requests. Flask is sync by default but can add async support.

---

### Virtual Environment (venv)

Always work in a venv per project. It isolates dependencies so one project's packages don't conflict with another's. Like having separate `node_modules` per project.

```bash
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install fastapi uvicorn
```

---

[← Core Flow](./01-core-flow.md) | [Index](./00-index.md) | [Next: React & Interview →](./03-react-and-interview.md)
