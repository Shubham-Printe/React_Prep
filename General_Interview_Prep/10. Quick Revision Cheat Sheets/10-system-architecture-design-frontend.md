# System/Architecture Design (Frontend)

## Summary
Design choices for scalable, resilient frontends (e.g., dashboards with multiple widgets).

## Key Practices
- Error Boundaries per widget.
- Code split widgets.
- Virtualize large tables/lists.
- Cache API results (browser storage, SWR, RTK Query).
- Use Web Workers for heavy transforms.

## Situational Scenarios
- Widget isolation: failure in one widget should not crash the page.
- Data-heavy dashboards: virtualization and caching strategies.

## Pitfalls
- Monolithic bundles and shared crashes across widgets.

## Checklist
- [ ] Isolation via Error Boundaries
- [ ] Performance via virtualization and code splitting
- [ ] Caching and background updates

