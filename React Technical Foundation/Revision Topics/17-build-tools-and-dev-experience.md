## Build Tools & Dev Experience

- [ ] Vite/ESBuild/Rollup/Webpack: configuration, dev/prod parity
- [ ] Babel/TS transpilation pipelines; JSX runtime, decorators, legacy flags
- [ ] Linting: ESLint React, hooks plugin; Prettier integration and conflicts
- [ ] Path aliases, module resolution, import boundaries
- [ ] Environment configs per env/stage; `process.env` vs runtime config
- [ ] Git hooks: Husky, lint-staged; pre-commit quality gates
- [ ] Monorepos: PNPM workspaces, Turborepo, Nx; shared UI packages

---

### Tooling landscape
Vite pairs fast dev server with ESBuild for transforms and Rollup for production builds. Webpack is flexible with a rich plugin ecosystem but can be heavier. Prefer fast feedback in dev and consistent prod builds; ensure dev/prod parity to avoid surprises.

---

### Transpilation pipeline
Use Babel or SWC to handle JSX/TS; ensure correct JSX runtime settings. Keep decorators and legacy flags consistent across tools. For TS, choose `tsc --noEmit` for types and a separate transpiler for speed (Vite/SWC).

---

### Linting and formatting
Configure ESLint with React and hooks plugins. Integrate Prettier for formatting; resolve rule conflicts via `eslint-config-prettier`. Run linting in CI and block merges on critical violations.

---

### Module resolution and boundaries
Use path aliases to simplify imports, but enforce boundaries (e.g., no cross-feature imports) with lint rules. Prefer relative imports within a feature and absolute imports across features to clarify intent.

---

### Environment configuration
Separate build-time env from runtime config. In frameworks like Next.js, use public vs server-only env variables correctly. Avoid leaking secrets to the client bundle.

---

### Git hooks and quality gates
Use Husky and lint-staged to run linters/tests on changed files. Keep hooks fast to avoid developer friction. Enforce code owners and CI checks for critical areas.

---

### Monorepos
Use PNPM/Turborepo/Nx for workspaces, caching, and task orchestration. Extract shared UI packages and utilities with strict versioning. Establish conventions for publishing and dependency constraints.


