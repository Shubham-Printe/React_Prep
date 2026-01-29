# Core Concepts (Frontend Context)

## 🟢 1. Event Loop & Async (Shared with Browser)
*You know this from React `useEffect` and API calls.*

- [ ] **The "Single Thread"**:
  -   JS runs on one thread. It can only do one thing at a time.
  -   **Non-Blocking**: It doesn't wait for API calls to finish. It sends the request and keeps running.
- [ ] **Macrotasks vs Microtasks**:
  -   **Microtasks** (Higher Priority): `Promise.then`, `process.nextTick`. Run immediately after current code.
  -   **Macrotasks** (Lower Priority): `setTimeout`, `setInterval`.
- [ ] **Interview Question**: "Output of this code?" (Sync -> NextTick -> Promise -> Timeout).

## 🟢 2. Modules (CommonJS vs ESM)
*You see this in your project configs.*

- [ ] **CommonJS (Legacy/Node standard)**:
  -   `const fs = require('fs')`
  -   `module.exports = { ... }`
  -   Dynamic (can put `require` inside an if statement).
- [ ] **ESM (Modern/Browser standard)**:
  -   `import fs from 'fs'`
  -   `export default ...`
  -   Static (must be at top level).
  -   **Note**: Node.js now supports ESM (set `"type": "module"` in package.json).

---

## 🟡 3. Global Objects
- [ ] `__dirname`, `__filename`: Path to current directory/file (useful for config).
- [ ] `process.env`: Accessing `.env` variables (API keys, DB URLs).
- [ ] `Buffer`: Raw binary data. (Rarely touched directly in modern app logic unless handling file uploads).

## 🔴 4. Streams (Deep Dive - Low Priority)
- [ ] **Concept**: Reading data chunk-by-chunk instead of all at once (Memory efficient).
- [ ] **Use Case**: Uploading a 2GB video file.
