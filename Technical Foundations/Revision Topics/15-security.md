## Security

- [ ] XSS: sanitization, `dangerouslySetInnerHTML`, template injection
- [ ] CSRF and CORS; tokens and cookie settings (SameSite, Secure, HttpOnly)
- [ ] Auth flows: OAuth/OIDC, PKCE, refresh tokens, rotation
- [ ] Secret handling: env exposure, public vs server-only vars
- [ ] Dependency risks: SCA, supply-chain attacks, lockfiles, integrity
- [ ] Content Security Policy (CSP) and Trusted Types

---

### XSS and content injection
Never render unsanitized HTML. Avoid `dangerouslySetInnerHTML` unless content is sanitized by a trusted pipeline. Validate and encode user input when displaying. Template injection can occur via attributes and URLs—validate protocols (no `javascript:`).

---

### CSRF, CORS, and cookies
Use same-site cookies (`SameSite=Lax|Strict`), `Secure`, and `HttpOnly` for session cookies. CSRF tokens or same-site cookies mitigate cross-site requests. Configure CORS narrowly: allow only needed origins and methods, and avoid wildcards with credentials.

---

### Authentication flows
For OAuth/OIDC, prefer Authorization Code with PKCE on public clients. Store refresh tokens securely (typically httpOnly cookies). Rotate tokens and handle revocation. Avoid storing tokens in localStorage due to XSS risk.

---

### Secrets and environment
Separate public runtime config from server-only secrets. Do not leak API keys to the client; proxy via server where necessary. Use build-time replacement carefully and scan bundles for unintended secrets.

---

### Supply chain and integrity
Keep dependencies updated, use lockfiles, and enable integrity checks. Monitor advisories (Snyk, npm audit) and avoid unmaintained packages. Pin transitive deps where necessary.

---

### CSP and Trusted Types
Set a strict Content Security Policy: disallow `unsafe-inline` where possible, use nonces or hashes for scripts, and restrict connect-src. Trusted Types help prevent DOM XSS by enforcing safe sinks; adopt progressively and fix violations.


