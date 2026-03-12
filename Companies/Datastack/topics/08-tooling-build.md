# Tooling and Build
- npm scripts, environment variables
- Bundlers (webpack/vite basics)
- Babel basics and transpilation
- Linting/formatting: ESLint, Prettier
- Git workflow (branching, PRs, reviews)
- CI/CD basics

## npm scripts and environment variables - Q&A
1. How do you use npm scripts in a React project? Give one example and why it matters.
   - npm scripts live in `package.json` under `"scripts"`. You run them with `npm run <name>` (e.g. `npm run build`, `npm run dev`). They let the team use the same commands everywhere and hide tool details (e.g. `"build": "vite build"` so everyone runs the same build without knowing Vite’s CLI). Example: `"dev": "vite"` starts the dev server; `"lint": "eslint src/"` runs lint. Scripts are the standard way to define dev, build, test, and lint workflows.

2. How do you use environment variables in a React project, and why do they matter for dev vs prod?
   - In Vite/CRA you use `import.meta.env.VITE_*` (Vite) or `process.env.REACT_APP_*` (CRA)—only variables with that prefix are exposed to the client so you don’t accidentally ship secrets. Use them for API base URL, feature flags, or analytics keys. Dev might point to a staging API (`VITE_API_URL=http://localhost:3000`); prod uses the real API URL. Never put secrets (API keys, passwords) in frontend env vars; they are visible in the built bundle. Use a `.env` file (and add `.env` to `.gitignore` if it has secrets) or set vars in CI for production builds.

## Bundlers (Webpack / Vite) - Q&A
3. What does a bundler do, and why do we need one for React?
   - A bundler (Webpack, Vite, etc.) takes your source (JS/TS, JSX, CSS, assets), resolves `import`/`require`, applies transforms (e.g. Babel, TypeScript), and produces one or more output files (bundles) that the browser can run. We need it because browsers don’t natively support npm modules, JSX, or TypeScript; the bundler compiles and packages everything into deployable assets and can do code-splitting, tree-shaking, and dev server with HMR.

4. In one sentence each: what is the main difference between Webpack and Vite for development?
   - **Webpack** typically bundles the whole app before serving, so dev startup can be slower for large projects. 
   - **Vite** uses native ES modules in dev: the browser loads modules on demand and the server transforms only what’s requested, so dev startup is fast and HMR is quick. 
   - For production builds, both produce optimized bundles; Vite uses Rollup under the hood.

## Babel and transpilation - Q&A
5. What is Babel, and why is it used in a React project?
   - Babel is a **transpiler**: it turns modern JS (ES6+, JSX, TypeScript if using Babel for it) into code that older browsers or Node can run. In React, we use it mainly for **JSX** (turning `<App />` into `React.createElement(...)`) and for **modern syntax** (e.g. optional chaining, async/await) so we can write clean code and still support target environments. Many tools (Vite, CRA, Webpack) run Babel under the hood via plugins/presets.

6. What is the difference between transpilation and compilation (in the context of front-end tooling)?
   - **Transpilation** converts source to equivalent source in another language or dialect (e.g. ES6 → ES5, JSX → JS)—same level of abstraction. - **Compilation** often means turning source into a lower-level or binary form (e.g. C to machine code). 
   - In front-end we usually say “transpile” for JS-to-JS or JSX-to-JS; “compile” is sometimes used loosely for TypeScript → JavaScript.

## Linting and formatting (ESLint, Prettier) - Q&A
7. What is ESLint, and why use it in a React project?
   - ESLint is a **linter**: it analyzes code for bugs, style issues, and rule violations (e.g. unused variables, missing deps in hooks, React rules). It runs in the editor and in CI so the team keeps a consistent, error-resistant style. 
   - For React we add plugins like `eslint-plugin-react` and `eslint-plugin-react-hooks` to catch React-specific issues (e.g. hooks rules, exhaustive deps). Run it via `npm run lint` and fix auto-fixable issues with `--fix`.

8. What is Prettier, and how does it differ from ESLint? How do you use them together?
   - **Prettier** is a **formatter**: it only cares about style (quotes, semicolons, line length, indentation) and rewrites the file. **ESLint** can catch logic and style; some ESLint rules overlap with Prettier (e.g. quotes). Use both: Prettier for formatting, ESLint for linting. Disable ESLint rules that conflict with Prettier (e.g. with `eslint-config-prettier`). Typical flow: write code → Prettier formats on save → ESLint checks rules; in CI run both so PRs must pass lint and format.

## Git workflow (branching, PRs, reviews) - Q&A
9. Describe a simple Git branching workflow for a feature (e.g. branch naming, when you create it, how you integrate).
   - Create a **branch** from the main line (e.g. `main` or `develop`) for the feature: e.g. `feature/search-filters` or `fix/login-error`. 
   - Do all commits for that feature on this branch. When done, open a **pull request (PR)** into the main line; after review and approval, **merge**. 
   - Then delete the feature branch and pull the latest main. This keeps main stable and isolates work until it’s reviewed and merged.

10. What do you expect from a good code review (as author and as reviewer)?
    - As **author**: small, focused PRs; clear description and how to test; address review comments or discuss. 
    - As **reviewer**: check correctness, edge cases, tests, readability, and adherence to project patterns; give specific, constructive feedback; distinguish must-fix from nice-to-have. Good reviews catch bugs and spread knowledge without blocking unnecessarily.

## CI/CD basics - Q&A
11. What is CI (continuous integration), and what do we typically run for a front-end project?
    - **CI** means automatically running checks on every push or PR (e.g. on GitHub Actions, GitLab CI, Jenkins). 
    - For a front-end project we usually run: **install** dependencies, **lint** the code (e.g. ESLint), **check formatting** (e.g. Prettier), **run tests** (e.g. Jest, React Testing Library), and **build** the app. These steps catch broken or inconsistent code before merge. 
    - If any step fails, the PR is marked failed so we don’t merge broken code.

12. What is CD (continuous deployment/delivery), and how does it relate to the front-end build?
    - **CD** means automatically deploying the app when code is merged (e.g. to staging or production). 
    - For front-end: when you merge, the pipeline runs (lint, test, build). 
    - If all steps pass, the **built files** (e.g. in `dist/` or `build/`) are deployed to a host like Vercel, Netlify, or S3 + CloudFront. 
    - You don't build and upload by hand—pushing to main runs the pipeline and deploys, so the live site matches the code in the repo.
