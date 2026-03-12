# CI/CD Setup Guide — React Project (GitHub Actions)

This document is a **first-time-friendly**, step-by-step guide to set up a CI/CD pipeline for your React project (Vite, TypeScript, Vitest, ESLint) using **GitHub Actions**. Follow it in order until you have a working pipeline.

---

## Table of contents

1. [What you’ll get](#1-what-youll-get)
2. [Prerequisites checklist](#2-prerequisites-checklist)
3. [Concepts in one minute](#3-concepts-in-one-minute)
4. [Step-by-step process](#4-step-by-step-process)
5. [What runs in the pipeline](#5-what-runs-in-the-pipeline)
6. [Optional: deployment](#6-optional-deployment)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. What you’ll get

After following this guide you will have:

- **CI (Continuous Integration)**  
  On every push/PR to GitHub: install dependencies → lint → run tests → build. If any step fails, the pipeline fails and you get a clear status on the repo.

- **Optional CD (Continuous Deployment)**  
  Automatically deploy the built app (e.g. to GitHub Pages, Vercel, or Netlify) when the main branch is green.

- **Visibility**  
  Green/red checkmarks on commits and PRs so you know if the codebase is in a good state before merging.

---

## 2. Prerequisites checklist

Before starting, ensure you have:

| Item | Details |
|------|--------|
| **GitHub account** | You’ll create a remote repo and use GitHub Actions. |
| **Project on your machine** | Your React app (e.g. `ci-cd-starter`) with tests and lint already working locally. |
| **Git initialized** | Run `git status` in the project root; you should see a repo. |
| **Node.js** | Same major version you use locally (e.g. Node 18 or 20). We’ll pin this in the workflow. |
| **Scripts working locally** | From project root: `npm install`, `npm run lint`, `npm run test`, `npm run build` all succeed. |
| **Secrets / .env** | If the app needs env vars (e.g. API keys), plan where to set them (e.g. GitHub Secrets) and never commit real secrets. |

**Optional for deployment:**

- **GitHub Pages**: no extra account; we use the same repo.
- **Vercel / Netlify**: free account; we’ll connect the GitHub repo.

---

## 3. Concepts in one minute

- **CI (Continuous Integration)**  
  Every time you push code (or open a PR), a pipeline runs on GitHub’s servers: it installs deps, lints, runs tests, and builds. This keeps the main branch buildable and tested.

- **CD (Continuous Deployment)**  
  After CI passes (e.g. on `main`), the pipeline can deploy the built app to a host so that “green main” automatically becomes the live site.

- **GitHub Actions**  
  GitHub’s built-in automation. You define **workflows** in YAML under `.github/workflows/`. Each workflow has **jobs** and **steps** (e.g. “checkout code → setup Node → npm install → lint → test → build”).

- **Runner**  
  The machine that runs your workflow (e.g. `ubuntu-latest`). You don’t manage it; GitHub provides it.

---

## 4. Step-by-step process

### Step 1: Prepare the project locally

1. **Use the right project folder**  
   e.g. `Demos/CI_CD/ci-cd-starter` (or your “small React project with tests”).

2. **Ensure these work in the project root:**
   ```bash
   npm install
   npm run lint
   npm run test
   npm run build
   ```
   - If `npm run test` runs Vitest in **watch** mode and never exits, add a CI test script (see [Step 4](#step-4-add-the-github-actions-workflow)) so CI runs `vitest run` (single run).

3. **Confirm `.env` is not committed**  
   - Check `.gitignore` contains `.env` or `*.local`.  
   - Never commit real API keys or secrets. For CI, we’ll use GitHub Secrets or repository variables if needed.

4. **Optional but recommended:** add a **CI-only test** script in `package.json`:
   ```json
   "test:ci": "vitest run"
   ```
   Then in the workflow we’ll run `npm run test:ci` so tests run once and exit.

---

### Step 2: Create the GitHub remote repository

1. On GitHub: **Repositories → New**.  
2. Name the repo (e.g. `react-ci-cd-demo`).  
3. Choose **Public**.  
4. **Do not** add a README, .gitignore, or license (you already have a local repo).  
5. Create the repository.  
6. Copy the **HTTPS** or **SSH** URL (e.g. `https://github.com/YOUR_USERNAME/react-ci-cd-demo.git`).

---

### Step 3: Push your local project to GitHub

From your project root:

```bash
# If this repo doesn’t have a remote yet:
git remote add origin https://github.com/YOUR_USERNAME/react-ci-cd-demo.git

# Or if you already have a different remote, rename or set URL:
# git remote set-url origin https://github.com/YOUR_USERNAME/react-ci-cd-demo.git

# Push your current branch (e.g. main or master)
git push -u origin main
```

If your default branch is `master`, use `git push -u origin master` and we’ll use `master` in the workflow in the next step.

---

### Step 4: Add the GitHub Actions workflow

1. **Create the workflow directory** in your project root:
   ```bash
   mkdir -p .github/workflows
   ```

2. **Create the workflow file**  
   Create `.github/workflows/ci.yml` (or `ci.yaml`) with the content below.  
   - Replace `main` with `master` if that’s your default branch.  
   - The workflow runs on every push and every pull request to that branch.

**`.github/workflows/ci.yml`:**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Run tests
        run: npm run test:ci
        # If you didn't add test:ci, use: npm run test -- --run

      - name: Build
        run: npm run build
```

3. **If you didn’t add `test:ci`**  
   Either add `"test:ci": "vitest run"` to `package.json` and keep `npm run test:ci` in the workflow, or in the workflow use:
   ```yaml
   - name: Run tests
     run: npm run test -- --run
   ```

4. **Commit and push the workflow:**
   ```bash
   git add .github/workflows/ci.yml
   git commit -m "Add CI workflow (lint, test, build)"
   git push
   ```

---

### Step 5: Verify the pipeline

1. Open your repo on GitHub.  
2. Go to the **Actions** tab.  
3. You should see a workflow run for the push you just made.  
4. Click the run → open the **build-and-test** job.  
5. All steps should be green (checkout → Setup Node → Install → Lint → Run tests → Build).

If any step fails:

- Click the failed step and read the log.  
- Fix the same issue locally (lint error, failing test, or build error), then commit and push again.

---

### Step 6: Optional — Run CI on pull requests

The same workflow already runs on `pull_request` to `main`. So:

1. Create a new branch: `git checkout -b feature/xyz`.  
2. Make a small change, commit, push: `git push -u origin feature/xyz`.  
3. Open a **Pull Request** to `main` on GitHub.  
4. In the PR you’ll see the CI status (e.g. “CI — build-and-test”); it must pass before you merge.

No extra config needed if you used the `on.push` and `on.pull_request` from Step 4.

---

## 5. What runs in the pipeline

| Step | Command | Purpose |
|------|--------|--------|
| Checkout | `actions/checkout@v4` | Get your repo code on the runner. |
| Setup Node | `actions/setup-node@v4` with `cache: 'npm'` | Install Node 20 and cache `node_modules` for speed. |
| Install | `npm ci` | Clean install from `package-lock.json` (reproducible, preferred for CI). |
| Lint | `npm run lint` | Fail if ESLint reports errors (or warnings if you use `--max-warnings 0`). |
| Test | `npm run test:ci` or `npm run test -- --run` | Run Vitest once; fail if any test fails. |
| Build | `npm run build` | Run `tsc && vite build`; fail if TypeScript or Vite build fails. |

Only if **all** steps succeed does the run show as successful.

---

## 6. Optional: Deployment (CD)

Once CI is stable, you can add **deployment** so every green build on `main` deploys.

### Option A: GitHub Pages (static hosting, free)

1. In the workflow, add a **deploy** job that runs only on push to `main` (not on PRs), after `build-and-test` passes.  
2. Use `actions/upload-pages-artifact` and `actions/deploy-pages` (or the older `peaceiris/actions-gh-pages`).  
3. In repo **Settings → Pages**, set source to **GitHub Actions**.  
4. Your site will be at `https://YOUR_USERNAME.github.io/REPO_NAME/`.  
5. If your app uses client-side routing (e.g. React Router), configure the host for SPA fallback (e.g. 404 → `index.html`); many guides exist for “GitHub Pages SPA”.

### Option B: Vercel

1. Sign up at [vercel.com](https://vercel.com) and connect your GitHub account.  
2. Import your repository; Vercel will detect Vite and set build command (`npm run build`) and output dir (`dist`).  
3. Vercel runs its own build; for consistency you can keep GitHub Actions CI as the “source of truth” and use Vercel only for deploy, or rely on Vercel’s built-in build + deploy.  
4. Add env vars in Vercel dashboard if your app needs them.

### Option C: Netlify

1. Sign up at [netlify.com](https://netlify.com) and connect GitHub.  
2. Add new site from Git → choose your repo.  
3. Build command: `npm run build`; publish directory: `dist`.  
4. Add env vars in Netlify if needed.

For a first-time setup, getting **CI (lint + test + build)** solid is enough. Add **CD** once you’re comfortable with the Actions tab and logs.

---

## 7. Troubleshooting

| Problem | What to check |
|--------|----------------|
| **Workflow doesn’t appear** | Ensure the file is at `.github/workflows/ci.yml` (or `.yaml`) and that you’ve pushed the commit that adds it. |
| **Wrong branch** | If your default branch is `master`, change `branches: [main]` to `branches: [master]` in `on.push` and `on.pull_request`. |
| **Tests hang in CI** | Vitest defaults to watch mode. Use `vitest run` (e.g. `npm run test:ci` or `npm run test -- --run`). |
| **Lint fails in CI only** | Run `npm run lint` locally; fix reported errors. Ensure ESLint config and extensions are committed. |
| **Build fails in CI** | Run `npm run build` locally. Fix TypeScript or Vite errors; ensure no reliance on local-only env or paths. |
| **Need env in CI** | Use **Settings → Secrets and variables → Actions**. Add a secret (e.g. `API_KEY`) and in the workflow: `env: { API_KEY: ${{ secrets.API_KEY }}`. Never log secrets. |
| **Node version mismatch** | Change `node-version` in the workflow to match your local (e.g. `'18'` or `'20'`). |

---

## Quick reference: minimal checklist

- [ ] Project has working `lint`, `test`, and `build` locally.  
- [ ] `test` runs once in CI (e.g. `vitest run` via `test:ci` or `--run`).  
- [ ] GitHub repo created; local project pushed.  
- [ ] `.github/workflows/ci.yml` added with: checkout → setup Node (with npm cache) → `npm ci` → lint → test → build.  
- [ ] Workflow triggered by push and PR to main (or master).  
- [ ] First run is green on the Actions tab.  
- [ ] (Later) Add deployment job or connect Vercel/Netlify if you want CD.

Once these are done, you have a complete CI (and optionally CD) setup you can reuse and extend (e.g. add coverage, typecheck-only job, or deploy to staging).
