# API & Frameworks (Frontend Focus)

## 🟢 1. REST API Principles (You consume these daily)
*Connecting your React knowledge to Backend design.*

- [ ] **Methods**:
  -   **GET**: Retrieve data (safe, idempotent).
  -   **POST**: Create data (not idempotent).
  -   **PUT**: Update/Replace **entire** resource.
  -   **PATCH**: Partial update (e.g., just changing the `email` field).
  -   **DELETE**: Remove resource.
- [ ] **Status Codes** (Important for error handling in React):
  -   **2xx**: Success (200 OK, 201 Created).
  -   **3xx**: Redirection (304 Not Modified - caching).
  -   **4xx**: Client Error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found).
  -   **5xx**: Server Error (500 Internal Server Error, 503 Service Unavailable).

## 🟢 2. Authentication vs Authorization
*How the backend handles the tokens you store in localStorage.*

- [ ] **AuthN (Who are you?)**:
  -   Verifying identity (username/password).
- [ ] **AuthZ (What can you do?)**:
  -   Verifying permissions (Admin vs User).
- [ ] **JWT (JSON Web Tokens)**:
  -   **Structure**: Header.Payload.Signature.
  -   **Frontend flow**: Login -> Receive JWT -> Store (HttpOnly Cookie best, localStorage common) -> Send in `Authorization: Bearer <token>` header.
- [ ] **Security Best Practices**:
  -   **CORS**: Middleware that tells browser "It's okay to accept requests from localhost:3000".
  -   **Hashing**: Never store plain passwords. Use Bcrypt.

## 🟢 3. Express.js Middleware
*The "Redux Middleware" of the server.*

- [ ] **Concept**: Functions that run **in between** the request coming in and the response going out.
- [ ] **Signature**: `(req, res, next) => { ... }`
- [ ] **Uses**:
  -   Logging (e.g., `morgan`).
  -   Parsing body (e.g., `express.json()` -> allows `req.body`).
  -   Auth check (Verify token before letting user see profile).
- [ ] **Key**: You MUST call `next()` or send a response (`res.send()`), otherwise the request hangs.

---

## 🟡 4. Microservices & Real-time (Conceptual)
- [ ] **WebSockets**:
  -   Used for: Chat, Live Notifications.
  -   Frontend: `socket.on('message')`, Backend: `io.on('connection')`.
- [ ] **Communication**: Services talk via HTTP or Message Queues.
