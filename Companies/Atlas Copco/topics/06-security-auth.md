# Security (OAuth, JWT) — JD-aligned
- OAuth basics and flows
- JWT: structure, validation, storage
- XSS and CSRF prevention
- Secure token handling in the frontend

## OAuth - Q&A
1. What is OAuth, and what problem does it solve?
   - **OAuth** is an authorization framework that lets an app access a user's resources on another service (e.g. "Log in with Google") without sharing passwords.
   - It separates **authentication** (who you are) from **authorization** (what you're allowed to access).

2. How does OAuth work? (simple flow — Authorization Code + PKCE, typical for SPAs)
   1. **App sends user to the provider.** User clicks “Log in with Google.” Your app redirects the browser to the provider’s login URL, with a **code_challenge** (PKCE) and your **client_id**, and a **redirect_uri** where the provider should send the user back.
   2. **User logs in at the provider.** User enters credentials on Google (or the provider). They might already be logged in and just approve “Allow this app.”
   3. **Provider redirects back with a code.** The provider redirects the browser to your `redirect_uri` with a **code** in the URL (and usually **state** to prevent CSRF). The **tokens are not** in the URL — only a short-lived code.
   4. **Your app exchanges the code for tokens.** Your frontend (or, better, your backend) sends the **code** plus the **code_verifier** (the secret that matches the earlier code_challenge) to the provider. The provider returns **access_token** (and often **refresh_token**). Only then do tokens exist; they were never in the browser redirect.
   5. **Your app uses the access token** to call APIs (e.g. as `Authorization: Bearer <token>`), and stores/refreshes it according to your security rules (e.g. memory, or backend sets HttpOnly cookie).
   **Why PKCE?** SPAs can’t keep a client secret safe. PKCE ties the code to your app: only the app that sent the code_challenge can send the matching code_verifier, so an attacker who intercepts the code can’t exchange it without the verifier.

3. As a frontend developer, what do you need to know about OAuth integration?
   - Frontend typically initiates the flow (redirect to provider), receives the callback (code or token in URL), and may need to pass the code to your backend for token exchange.
   - Never store client secrets in the frontend; use PKCE for SPAs. Tokens from OAuth should be handled like any auth token (see JWT section).

## JWT - Q&A
1. What is a JWT, and what are its parts?
   - **JWT (JSON Web Token)** is a compact, URL-safe way to represent claims between two parties. Three parts (base64url-encoded, dot-separated):
     - **Header**: algorithm and token type.
     - **Payload**: claims (e.g. `sub`, `exp`, `iat`, custom data).
     - **Signature**: used to verify the token hasn't been tampered with.
   - **How JWT is used for authentication:** 
   (1) User logs in (e.g. username/password or after OAuth). 
   (2) Server verifies credentials and **issues a JWT** (payload usually includes `sub` = user id, `exp` = expiry; signed with a secret or key only the server knows). 
   (3) Client **stores** the JWT and **sends it with each request** (e.g. `Authorization: Bearer <token>` or in an HttpOnly cookie). 
   (4) Server **verifies** the JWT (checks signature and `exp`); if valid, it treats the request as authenticated and uses claims (e.g. `sub`) to know who the user is. No session store needed on the server — the token itself carries the claims; that’s “stateless” auth.  
   **How verification works:** JWT is **encoded** (base64url), not **encrypted** — anyone can decode the header and payload and read the contents. What makes it trustworthy is the **signature**. The server (and only the server) has the **secret** (or public key in asymmetric setups). To verify, the server recomputes the signature over the same header+payload using that secret; if it matches the signature in the token, the token wasn’t tampered with and was issued by someone who holds the secret. So: don’t put sensitive data in the payload (it’s visible); the **signature** is what proves authenticity and integrity.

2. Where should you store JWTs in a frontend app, and what should you avoid?
   - **Prefer**: **HttpOnly cookies** (set by the server, not readable by JS)—XSS can't steal the token. Browser sends the cookie with requests; frontend doesn't read or store it.
   - **Avoid**: **localStorage** or **sessionStorage**—any script (including XSS) can read them.
   - **If you must use a token in JS** (e.g. Bearer header): keep it in **memory** (variable/ref), don't persist to localStorage; use short-lived tokens and refresh tokens in HttpOnly cookies when possible.

3. How do you send a JWT with API requests?
   - **Cookie**: If the backend sets an HttpOnly cookie, the browser sends it automatically with same-origin requests. No frontend code needed.
   - **Bearer header**: If using a token in memory, add `Authorization: Bearer <token>` to fetch/axios headers.

4. What should you never put in frontend code or client-bundled env vars?
   - **Never**: API keys, passwords, private keys, long-lived tokens. The bundle is visible to anyone who loads the app.
   - Use frontend env vars only for non-secret config (API base URL, feature flags). Secrets stay on the server.

## XSS and CSRF - Q&A
1. How do you prevent XSS in React?
   - React **escapes** text in JSX by default, so `{userInput}` is safe. Avoid `dangerouslySetInnerHTML` unless necessary; if used, sanitize with DOMPurify. Never run untrusted code (`eval`, `href="javascript:..."`).

2. How do you mitigate CSRF?
   - **Backend**: CSRF tokens, or `SameSite=Strict`/`Lax` on cookies.
   - **Frontend**: Send the CSRF token the server expects (e.g. from meta tag, in header for API calls). Don't rely on frontend alone.
