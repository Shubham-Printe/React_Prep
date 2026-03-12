# APIs and Integration
- RESTful APIs, request lifecycle
- Loading/error/empty states
- Retry strategy and cancellation (AbortController)
- CORS basics and browser constraints
- Pagination, sorting, filtering strategies
- Debounce/throttle for search and input

## APIs and Integration - Q&A
1. In a React app, when you call a REST API (e.g. with fetch), what are the main stages from "user triggers the request" to "UI shows the result"? What state do you typically keep and when do you update it?
   - As soon as the user triggers the request, set status to **loading** (and optionally clear previous error so the UI doesn't show stale error + spinner). Keep loading until the API responds.
   - When the response arrives: 
      - on **success**, update the **data** state that drives what's rendered (e.g. list, details); 
      - on **failure**, set an **error** state (message or code) so the UI can show an error message or retry.
   - Typical state shape: `loading` (boolean), `data` (response payload or null), `error` (error message or null).

2. How do you handle loading, error, and empty (no data) states in the UI? Where does that logic live?
   - **Loading**: 
      - Use a global loader when any API request is in flight, so the user knows something is happening. 
      - For component-level loading (e.g. a single list or form), keep loading state in a **custom hook** that performs that API call. The component just renders spinner vs content based on that.
   - **Error**: 
      - A **global toast** shows when any API call fails, triggered when the hook or data layer sets an error. 
      - For **forms**, keep **inline errors** at form level: store validation or API error messages in form state and show them next to fields or at the top of the form.
   - **Empty**: 
      - At the **local (component) level**, have a **fallback UI**. 
      - When `data` is loaded but empty (e.g. empty array or null), render that fallback instead of a blank area so the user knows there's no data rather than a broken load.

3. Why would you use AbortController with fetch? What problem does it solve, and when would you abort a request?
   - **AbortController** 
      - lets you **cancel** an in-flight `fetch` request. 
      - You pass `signal: controller.signal` into `fetch`; 
      - calling `controller.abort()` cancels the request so the promise rejects (with AbortError) and you never process the response.

      ```js
      useEffect(() => {
        const controller = new AbortController();
        fetch('/api/users', { signal: controller.signal })
          .then(res => res.json())
          .then(setData)
          .catch(err => {
            if (err.name !== 'AbortError') setError(err);
          });
        return () => controller.abort();  // cleanup on unmount
      }, []);
      ```

   - **When to abort**:
     1) **Unmount**: 
      - User navigates away before the response arrives. 
      - so we use Abort in `useEffect` cleanup.
      - Without cancellation, the response can still arrive and you might call `setState` on an unmounted component. 

     2) **Rapid re-triggers (search, filters, pagination)**: 
      - A new request fires while the previous one is in flight. 
      - Abort the previous request when starting the new one so only the **latest** response is applied; otherwise an older response can overwrite a newer one (race condition).

4. What is CORS in one sentence? If the browser blocks your frontend's request to another domain with a CORS error, is that a frontend fix, a backend fix, or both? Why?
   - **CORS (Cross-Origin Resource Sharing)** is a **browser-enforced** policy: 
      - the server declares which origins may read responses from its API via headers (e.g. `Access-Control-Allow-Origin`); 
      - the browser blocks the response if the request's origin isn't allowed, to prevent other sites from misusing the API.

   - It's a **backend fix**. 
      - The backend must send the right CORS headers (e.g. include the frontend's origin in `Access-Control-Allow-Origin`) so the browser allows the frontend to read the response. 
      - The frontend cannot bypass CORS—that's intentional so a malicious site can't call your API with the user's credentials. 
      - In development you can use a **proxy** (e.g. in Vite/Webpack) so the browser sees same-origin requests; 
      - in production the server still needs to send correct CORS headers for the real frontend origin.

5. For a search input that calls an API on every keystroke, what's wrong with that, and how would you improve it? What do debounce and throttle do (one sentence each)?
   - **Problem**: 
      - Calling the API on every keystroke overloads the server with many requests and wastes client work; 
      - it's inefficient, and the user doesn't need a result for each character—they expect a result when they've finished or paused typing.

   - **Improvement**: 
      - Use **debounce** for search: wait until the user has stopped typing for a short period (e.g. 300ms), then fire one API call. 
      - Optionally combine with **AbortController** so a new keystroke cancels the previous in-flight request.

   - **Debounce**: 
      - Runs the action only **after** a quiet period (e.g. no input for 300ms)—so you fire once when the user pauses.
      - Use for: search-as-you-type (call API only after user stops typing).
      - **Simple example:** User types "hello" quickly. With 300ms debounce, the search runs **once**, 300ms after they stop typing — not on every keystroke.
      ```js
      function debounce(fn, ms) {
        let timer;
        return (...args) => {
          clearTimeout(timer);
          timer = setTimeout(() => fn(...args), ms);
        };
      }
      const search = debounce((q) => fetch(`/api/search?q=${q}`), 300);
      // <input onChange={e => search(e.target.value)} />
      ```
   
   - **Throttle**: 
      - Runs the action **at most once per time window** (e.g. every 500ms)—so you cap how often the action runs even if the user keeps triggering it. 
      - Use for: scroll/resize handlers (update at most every N ms while user scrolls).
      - **Simple example:** User scrolls for 3 seconds. With 200ms throttle, the handler runs **at most** every 200ms (e.g. ~15 times), not hundreds of times.
      ```js
      function throttle(fn, ms) {
        let last = 0;
        return (...args) => {
          const now = Date.now();
          if (now - last >= ms) { last = now; fn(...args); }
        };
      }
      const onScroll = throttle(() => console.log('scroll'), 200);
      // window.addEventListener('scroll', onScroll);
      ```
