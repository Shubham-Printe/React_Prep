# Part III — React Integration & Interview Positioning

[← Index](./00-index.md) | [← Python Syntax](./02-python-syntax-and-concepts.md)

---

### How React Fits In

React calls Python APIs the same way it calls Node. The backend language doesn't change what the frontend does.

**What React does:**
- `fetch("/api/users")` or `axios.get("/api/users")`
- Same loading/error/data handling (see `04-apis-integration.md` in the topics folder)
- Sends `Authorization: Bearer <token>` for protected routes

**What the Python backend must do:**
- Configure CORS so the browser allows the frontend origin (FastAPI: `CORSMiddleware`; Flask: `flask-cors`)
- Return JSON responses
- Validate and handle requests the same way a Node backend would

The contract between React and the backend is the same. Python just implements it.

---

### Interview Positioning — Python Terms to Use

**If asked "Do you know Python?"**

"I'm building backend skills with Node.js first; the concepts—REST APIs, async, validation, error handling—transfer directly. I've reviewed Python's ecosystem (Flask, FastAPI) and syntax. I'm excited to apply this in Python and learn on the job."

**If asked "What Python framework would you use for APIs?"**

"FastAPI for modern async APIs with built-in docs, or Flask for something lightweight. Both fit well with a React frontend and are common in industrial/embedded contexts."

**Phrases that show you're learning the stack:**
- "I've been looking at **FastAPI** with **Pydantic** for validation and **uvicorn** to run it. The decorator-based routing and type hints feel familiar from the patterns I use on the frontend."
- "I understand **ASGI** vs **WSGI** — FastAPI uses ASGI for async, which fits well with the kind of I/O we'd have with React and embedded services."
- "I've set up a **venv** and run a simple API locally. The flow from React → Python backend is the same as React → Node — REST, JSON, same error and loading handling."

---

### Suggested Next Steps

- [ ] Create a venv, install FastAPI + uvicorn
- [ ] Build one GET and one POST route; call them from a React app
- [ ] Use Pydantic for a request body; see auto validation and OpenAPI docs at `/docs`

---

[← Python Syntax](./02-python-syntax-and-concepts.md) | [Index](./00-index.md)
