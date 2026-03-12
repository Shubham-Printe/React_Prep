# APIs and Integration

- RESTful APIs, request lifecycle
- Loading/error/empty states
- Retry strategy and cancellation (AbortController)
- CORS basics and browser constraints
- Pagination, sorting, filtering strategies
- Debounce/throttle for search and input

## Q&A

### 1. Request lifecycle and state

**In a React app, when you call a REST API (e.g. with fetch), what are the main stages from “user triggers the request” to “UI shows the result”? What state do you typically keep and when do you update it?**

- As soon as the user triggers the request, set status to **loading** (and optionally clear previous error so the UI doesn’t show stale error + spinner). Keep loading until the API responds.
- When the response arrives: on **success**, update the **data** state that drives what’s rendered (e.g. list, details); on **failure**, set an **error** state (message or code) so the UI can show an error message or retry.
- **Typical state shape:** `loading` (boolean), `data` (response payload or null), `error` (error message or null). 
- Update them stagewise so the UI can show loading spinner, content, or error consistently and never show stale data as if it were current.

---

### 2. Loading, error, and empty states

**How do you handle loading, error, and empty (no data) states in the UI? Where does that logic live?**

- **Loading:** Use a global loader (one indicator or global state) when any API request is in flight. For component-level loading (e.g. a single list or form), keep loading state in a **custom hook** that performs that API call and returns `{ data, loading, error }`; the component just renders spinner vs content based on that.
- **Error:** A **global toast** (or error boundary) when any API call fails. For **forms**, keep **inline errors** at form level: store validation or API error messages in form state and show them next to fields or at the top of the form.
- **Empty:** At the **local (component) level**, use a **fallback UI** (empty state message or illustration). When `data` is loaded but empty (e.g. empty array or null), render that fallback instead of a blank area so the user knows there’s no data rather than a broken load.

---

### 3. AbortController and cancellation

**Why would you use AbortController with fetch? What problem does it solve, and when would you abort a request?**

- **What it does:** **AbortController** lets you **cancel** an in-flight `fetch` request. Pass `signal: controller.signal` into `fetch`; calling `controller.abort()` cancels the request so the promise rejects (with AbortError) and you never process the response.

  **Example (abort on unmount):**
  ```ts
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/data", { signal: controller.signal })
      .then((res) => res.json())
      .then(setData)
      .catch((err) => {
        if (err.name !== "AbortError") setError(err);
      });
    return () => controller.abort(); // cancel when component unmounts
  }, []);
  ```
- **When to abort — unmount:** If the user navigates away (component unmounts) before the response arrives, the data is useless. Without cancellation, you might call `setState` on an unmounted component (React warning) or overwrite state with stale data. Aborting in a `useEffect` cleanup cancels the request so you never handle that response.
- **When to abort — rapid re-triggers (e.g. search):** With debounce, a new request can still fire while the previous one is in flight. Abort the previous request when starting the new one so only the **latest** response is applied; otherwise an older response can overwrite a newer one (race condition). Same idea for filters, pagination, or any input that triggers a new fetch before the last one finishes.

---

### 4. CORS

**What is CORS in one sentence? If the browser blocks your frontend’s request to another domain with a CORS error, is that a frontend fix, a backend fix, or both? Why?**

- **CORS (Cross-Origin Resource Sharing)** is a **browser-enforced** policy: the server declares which origins may read responses from its API via headers (e.g. `Access-Control-Allow-Origin`); the browser blocks the response if the request’s origin isn’t allowed.
- **It’s a backend fix.** The backend must send the right CORS headers (e.g. include the frontend’s origin in `Access-Control-Allow-Origin`) so the browser allows the frontend to read the response. The frontend cannot bypass CORS—that’s intentional so a malicious site can’t call your API with the user’s credentials.
- **In development:** you can use a **proxy** (e.g. in Vite/Webpack) so the browser sees same-origin requests. **In production:** the server still needs to send correct CORS headers for the real frontend origin.

---

### 5. Search on keystroke, debounce, throttle

**For a search input that calls an API on every keystroke, what’s wrong with that, and how would you improve it? What do debounce and throttle do (one sentence each)?**

- **Problem:** Calling the API on every keystroke overloads the server and wastes client work; the user expects a result when they’ve finished or paused typing, not for each character.
- **Improvement:** Use **debounce** for search: wait until the user has stopped typing for a short period (e.g. 300ms), then fire one API call. Optionally combine with **AbortController** so a new keystroke cancels the previous in-flight request.
- **Debounce:** Runs the action only **after** a quiet period (e.g. no input for 300ms)—fire once when the user pauses.
- **Throttle:** Runs the action **at most once per time window** (e.g. every 500ms)—cap how often the action runs even if the user keeps triggering it. Better for scroll/resize; for search-as-you-type, debounce is usually the better fit.
