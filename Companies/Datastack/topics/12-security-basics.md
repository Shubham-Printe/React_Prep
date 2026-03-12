# Security Basics
- XSS and how to prevent it
- CSRF basics
- Secure handling of tokens and secrets

## XSS and how to prevent it - Q&A
1. What is XSS (cross-site scripting), and how can it happen in a React app?
   - **What XSS is**  
     **XSS (Cross-Site Scripting)** is when an **attacker** injects malicious JavaScript into your app so it runs in a **victim** user's browser (e.g. when they load the page). **The threat:** that script runs with the victim's privileges—the attacker can steal their session or tokens, log what they type, or perform actions in their name.

   - **How it can happen in React**  
     When you render **user or API data** as raw HTML (e.g. with `dangerouslySetInnerHTML`) or put it in places that run code (e.g. `href="javascript:..."`), you turn off React's normal protection. Then any script the attacker hid in that data runs in the victim's browser and can steal cookies, tokens, or change the page.

   - **Stored vs reflected XSS**  
     **Stored**: The attacker’s script is saved on your server (e.g. in a comment or profile). Every user who later views that content runs the script.  
     **Reflected**: The script is not stored. It arrives in a request (e.g. in the URL or a form) and your app sends it back in the page. The victim runs it when they open the link or submit the form.

2. How do you prevent XSS in a React application?
   - **React’s default**  
     React **escapes** text in JSX, so `{userInput}` is rendered as text, not HTML. That prevents most XSS as long as you don’t bypass it.

   - **dangerouslySetInnerHTML**  
     Avoid it unless necessary. If you must render HTML (e.g. rich content), **sanitize** it first with a library like DOMPurify so script and dangerous attributes are stripped.

   - **Never run untrusted code**  
     Don’t put untrusted data in `eval`, inline event handlers, or `href="javascript:..."`.

   - **URLs**  
     Validate or sanitize (allow only `http`/`https`).

   - **Dependencies**  
     Keep them updated so you don’t ship known-vulnerable libraries.

## CSRF basics - Q&A
3. What is CSRF (cross-site request forgery), and how does it work?
   - **What CSRF is**  
     When a malicious site tricks the user’s browser into sending a request to *your* app (e.g. form submit or GET) using the user’s existing session. The user is already logged in; the attacker can’t read the response but can trigger a **state-changing** action (e.g. change email, transfer money).

   - **How it works**  
     Cookies are sent automatically with the request, so the browser sends it with the user’s cookies and your server treats it as legitimate. It works because cookies are sent on same-site and cross-site requests unless the cookie has `SameSite` protection.

4. How do you mitigate CSRF on the front-end and back-end?
   - **CSRF tokens (back-end)**  
     Server issues a token per session or per form; the client sends it in a header or form field; server rejects requests without a valid token.

   - **SameSite cookie**  
     Set `SameSite=Strict` or `Lax` so the cookie isn’t sent on cross-site requests (or only on safe top-level navigations with Lax).

   - **Front-end**  
     Don’t rely on front-end alone—always send the CSRF token the server expects (e.g. from a meta tag or cookie, in a header for API calls). For same-origin SPAs using cookies, SameSite and correct CORS plus CSRF token (if needed) are the main defenses.

## Secure handling of tokens and secrets - Q&A
5. Where should you store auth tokens (e.g. JWT) in a front-end app, and what should you avoid?
   - **Prefer**  
     **HttpOnly cookies** (set by the server, not readable by JS)—XSS can't steal the token. The browser sends the cookie with requests; your front-end doesn't need to read or store it.
     Example: server sends `Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict` in the response; the browser stores it and attaches it to same-site requests only. JS cannot read it via `document.cookie`.

   - **Avoid**  
     Storing tokens in **localStorage** or **sessionStorage**—any script on the page (including injected XSS) can read them.

   - **If you must use a token in JS**  
     E.g. for a Bearer header because the API doesn’t use cookies: keep it in **memory** (variable or ref), don’t persist to localStorage, use short-lived tokens and refresh tokens stored in HttpOnly cookies if possible.

6. What should never be in front-end code or environment variables that are bundled for the browser?
   - **Never in the bundle**  
     **Secrets**: API keys, passwords, private keys, or long-lived tokens. Don’t put them in front-end code or in env vars embedded in the client (e.g. `VITE_API_KEY`). The bundle is visible to anyone who loads the app.

   - **Use front-end for**  
     Non-secret config only (e.g. public API base URL, feature flags).

   - **Secrets on the server**  
     For keys that must stay secret, keep them on the **server**; the front-end calls your backend, and the backend uses the secret to talk to third-party APIs.

   - **If you need a key in the client**  
     E.g. public analytics: use keys restricted by domain or usage in the provider’s dashboard so abuse is limited.
