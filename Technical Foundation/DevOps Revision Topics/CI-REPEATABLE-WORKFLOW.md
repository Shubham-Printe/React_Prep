# CI — Repeatable workflow for any project

Use this as a **checklist** whenever you want to add GitHub Actions CI to a new repo. Same steps every time.

---

## 1. Local prep (project root)

```bash
npm install
npm run lint
npm run test
npm run build
```

- If **tests** run in watch mode and never exit, add to `package.json`:
  ```json
  "test:ci": "vitest run"
  ```
  (Or equivalent for Jest: `"test:ci": "jest --ci"`.)
- Ensure **`.env`** (and `.env.local`) are in `.gitignore`. Do not commit secrets.

---

## 2. GitHub repo

- Create a **new repo** on GitHub (no README / .gitignore / license if you already have a local repo).
- Add (or fix) remote and push:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
  # or: git remote set-url origin https://github.com/YOUR_USERNAME/REPO_NAME.git
  git push -u origin main
  ```
  Use `master` instead of `main` if that’s your default branch.

---

## 3. Add the workflow file

Create **`.github/workflows/ci.yml`**:

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
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Run tests
        run: npm run test:ci
        # or: npm run test -- --run

      - name: Build
        run: npm run build
```

- Replace **`main`** with **`master`** if needed.
- Replace **`test:ci`** with your CI test command if different (e.g. `npm run test -- --run`).
- Set **`node-version`** to match the project (e.g. `"18"` or `"20"`).

---

## 4. Commit and push

```bash
git add .github/workflows/ci.yml
git commit -m "Add CI workflow (lint, test, build)"
git push
```

---

## 5. Verify

- GitHub → repo → **Actions** tab.
- Open the latest run; all steps (Checkout → Setup Node → Install → Lint → Run tests → Build) should be green.

---

## One-off tweaks (when needed)

| Need | Change |
|------|--------|
| Different default branch | Use `branches: [master]` (or your branch) in `on.push` and `on.pull_request`. |
| Different Node version | Set `node-version: "18"` (or `"22"`) in Setup Node step. |
| No lint script | Remove the Lint step or add a no-op script. |
| No build (e.g. lib only) | Remove the Build step or run only tests. |
| Env vars in CI | Repo **Settings → Secrets and variables → Actions**; reference as `${{ secrets.NAME }}` in the workflow under `env:`. |

---

## Quick copy-paste (create workflow file)

```bash
mkdir -p .github/workflows
```

Then create `.github/workflows/ci.yml` with the YAML from **Section 3** above.

Done. Use this same flow for every new project.
