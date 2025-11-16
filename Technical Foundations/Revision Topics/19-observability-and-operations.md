## Observability & Operations

- [ ] Runtime logging strategy and redaction of PII
- [ ] Metrics and tracing in the browser; correlation IDs
- [ ] Feature flags and config delivery; kill switches
- [ ] Error triage workflows and SLOs for frontend (INP, error rate)
- [ ] Release strategies: canary, phased rollouts, A/B testing
- [ ] Performance budgets and continuous monitoring

---

### Logging
Define log levels and redact PII at the source. Structure logs (JSON) for machine parsing and attach context (user, route, feature flag). Sample aggressively in high-volume areas.

---

### Metrics and tracing
Capture user-centric metrics (Web Vitals), custom counters, and timings. Propagate correlation/trace IDs across requests to connect frontend spans to backend traces with OpenTelemetry.

---

### Feature flags and kill switches
Roll out features gradually and be able to disable them instantly. Keep flag evaluation fast and cacheable; guard risky code paths.

---

### Incident response and SLOs
Define frontend SLOs (e.g., INP < threshold for p75). Set alerts on error rates and Web Vitals regressions. Establish on-call and runbooks for triage.

---

### Releases
Use canary and progressive delivery. A/B test carefully with guardrails for performance and errors. Roll back quickly on issues.

---

### Budgets and monitoring
Set performance budgets (JS size, route TTI). Monitor continuously and block regressions in CI where possible.


