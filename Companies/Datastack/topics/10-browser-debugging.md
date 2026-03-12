# Browser and Debugging
- DevTools (network, performance, React Profiler)
- Storage: localStorage, sessionStorage, cookies
- Caching basics (HTTP cache, service worker awareness)
- Cross-browser compatibility
- Observation / monitoring (e.g. Sentry)

## DevTools (Network, Performance, React Profiler) - Q&A
1. How do you use the browser DevTools Network tab to debug API or loading issues?
   - **What it shows**  
     Every request (XHR/fetch, JS, CSS, etc.): URL, method, status, size, and time. Check **Headers** (request/response), **Preview** (response body), and **Timing** (blocking, latency) to see if a request was sent, returned 4xx/5xx, or is slow.

   - **API debugging**  
     Confirm the request is sent with the right URL and payload; confirm the response status and body.

   - **Performance**  
     Spot large assets, slow requests, or waterfalls (requests blocked by previous ones).

2. How do you use the Performance tab and React DevTools Profiler to find front-end performance issues?
   - **Chrome Performance**  
     Record a session (e.g. page load or interaction), then inspect the flame chart for long **tasks** (block main thread), **layout thrash** (repeated reflow), or **jank** during animations. Identify what JS or rendering is slow.

   - **React DevTools Profiler**  
     Start profiling, interact with the app, stop; it shows which components re-rendered, how often, and why (props/state change). Use it to find unnecessary re-renders and expensive components, then optimize with memo, splitting state, or moving work off the main thread.

## Storage: localStorage, sessionStorage, cookies - Q&A
3. What’s the difference between localStorage, sessionStorage, and cookies? When would you use each?
   - **localStorage**  
     Same-origin only; ~5–10 MB; no expiry; not sent with requests; data persists until you clear it. Good for user preferences, theme, or other non-sensitive data that should survive browser restarts.

   - **sessionStorage**  
     Same as localStorage in capacity and API, but the data is cleared when the **tab** (or window) is closed. Use it for tab-scoped temporary data (e.g. form drafts, wizard state).

   - **cookies**  
     Small (~4 KB per cookie); sent with every request to the domain in the `Cookie` header; support expiry, path, and security flags (HttpOnly, Secure, SameSite). Use for session IDs, auth tokens (prefer HttpOnly to reduce XSS risk), or any data the server must see on each request.

4. What are the main security and UX pitfalls of storing sensitive data in localStorage?
   - **Security**  
     Any JS on the page can read localStorage (XSS can steal tokens). No HttpOnly equivalent, so auth tokens in localStorage are risky; prefer cookies with HttpOnly or short-lived tokens in memory.

   - **UX**  
     localStorage is synchronous and can block the main thread if you store large data; 
    Don’t store passwords or long-lived tokens there; use it for non-sensitive preferences only.

## Caching basics (HTTP cache, service worker) - Q&A
5. How does HTTP caching work (e.g. Cache-Control), and what’s a simple strategy for static assets vs API responses?
   - **How it works**  
     The server sends **Cache-Control** (and optionally **ETag** / **Last-Modified**) to tell the browser how long it can reuse a response.

   - **Static assets**  
     JS, CSS, images with hashed filenames: use long cache (e.g. `max-age=31536000`) so repeat visits don’t re-download; the filename hash invalidates when content changes.

   - **API responses**  
     Use short cache or `no-store` / `no-cache` so data stays fresh; or `private` and short `max-age` for user-specific data. Don’t cache mutable API data aggressively or users see stale data.

6. What is a service worker in one sentence? How does it relate to caching and offline?
   - **What it is**  
     A **service worker** is a script that runs in the background, separate from the page; it can intercept network requests and serve cached responses.

   - **Caching and offline**  
     It’s used for **offline support** and **caching**: you cache assets or API responses in a cache store and return them when the network fails or when you want to speed up repeat visits.

   - **In React**  
     React apps often use it via tools like Workbox (e.g. with Create React App or Vite PWA) for offline-first or faster loads.

## Cross-browser compatibility - Q&A
7. What are common causes of cross-browser issues in a React/front-end app, and how do you approach them?
   - **Causes**  
     Different JS/CSS support (older browsers), different behavior of APIs (e.g. date, scroll, touch), or bugs in a specific browser.

   - **Approach**  
     (1) Define **target browsers** (e.g. last 2 versions, or a list) and use **Babel** + **autoprefixer** so syntax and prefixes are handled. (2) Use **polyfills** for missing APIs if needed. 
     (3) Test in real browsers (or BrowserStack) and use **caniuse** to check support. 
     (4) Avoid relying on bleeding-edge or non-standard behavior without a fallback.

8. What’s the difference between a polyfill and a transpiled feature? Give one example of each.
   - **Transpilation**  
     Converts **syntax** to older syntax (e.g. Babel turns arrow functions into regular functions so old engines can parse it).

   - **Polyfill**  
     Provides a **missing API** by implementing it in JS (e.g. `core-js` adds `Promise`, `Array.prototype.includes`, or `fetch` in environments that don’t have them).

   - **Summary**  
     Transpilation = “rewrite syntax”; polyfill = “add the runtime behavior.” Both help support older browsers.

## Observation / monitoring (e.g. Sentry) - Q&A
9. What is Sentry (or a similar tool), and how do you use it in a front-end app?
   - **What it is**  
     A tool that watches for **errors** and **slow performance**. You add a small library—an **SDK (Software Development Kit)**—to your app so it can report errors and timing to Sentry.

   - **What it captures**  
     **Errors** that your code doesn’t catch, and **failed promises**. Sentry gets the error, stack trace, who the user was, and what they did before it broke. You get alerts and a dashboard to fix production bugs.

   - **Performance**  
     You can also track how long **page loads** and **navigations** take, so you can find slow pages or API calls.

   - **Why use it**  
     So you find out when users see errors in production and can fix them using real stack traces and the steps that led to the error.

10. Besides error tracking, what other “observation” or monitoring do you consider for a production front-end?
   - **Performance**  
     Real User Monitoring (RUM) or Web Vitals (LCP, FID/INP, CLS) to see how the app performs for real users.

   - **Analytics**  
     Key flows (signup, checkout) and funnels.

   - **Logging**  
     Structured logs for critical actions (e.g. API failures, auth events) without logging PII or secrets.

   - **Uptime / synthetic checks**  
     Periodic requests to key URLs to confirm the app is reachable.

   - **Summary**  
     Together with error tracking (e.g. Sentry), this gives visibility into reliability, performance, and usage so you can prioritize fixes and improvements.
