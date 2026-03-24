# CD: Deploy on Vercel only after CI passes

Your app is on Vercel and Vercel already redeploys on every push to `main`. Right now that deploy happens **before** (or regardless of) your GitHub Actions CI (lint, test, build). So you could end up with a live site that failed tests.

**Goal:** Production should only update **after** CI has passed (lint, test, build green).

**Solution:** Use Vercel’s **Deployment Checks**. Vercel still builds on push, but it **does not promote** that build to your production URL until the checks you configure (e.g. your CI workflow) pass.

---

## What you need to do

### 1. Prerequisites (confirm once)

- Project is linked to GitHub via **Vercel for GitHub** (repo shows in [Project → Settings → Git](https://vercel.com)).
- **Production** environment has **automatic aliasing** turned on: [Project → Settings → Environments → Production](https://vercel.com) (so production domain points to the latest promoted deployment).

### 2. Enable Deployment Checks and add your CI

1. Open **Project → Settings → Deployment Checks** (or [vercel.com → your team → project → Settings → Deployment Checks](https://vercel.com)).
2. Click **Add Checks**.
3. Under **GitHub Actions**, select the check that represents your CI:
   - Usually the **job name** of your workflow, e.g. **`build-and-test`** (from the `build-and-test` job in `.github/workflows/ci.yml`).
   - The exact name is what GitHub reports as the check name for that job (e.g. “CI / build-and-test” or similar).
4. Save.

### 3. What happens from now on

| Step | What happens |
|------|----------------|
| 1 | You push (or merge) to `main`. |
| 2 | Vercel starts a **production build** (same as today). |
| 3 | GitHub Actions runs your **CI** (lint → test → build). |
| 4 | Vercel **waits** and does **not** assign the new build to your production URL until the selected check passes. |
| 5 | When CI is **green**, Vercel **promotes** the build to production (your live URL updates). |

So: **CD is “ready”** — production only updates after tests (and lint/build) pass. No changes to your GitHub Actions workflow are required; Vercel reads the commit status from GitHub.

---

## If the check name doesn’t appear

GitHub reports statuses using the **workflow name** and **job name**. In your workflow you have:

- `name: CI`
- Job: `build-and-test`

So in Vercel’s “Add Checks” list you might see something like **“CI / build-and-test”** or **“build-and-test”**. Pick the one that corresponds to this job. If you don’t see it, push a commit to `main`, wait for the workflow to run once, then refresh the Deployment Checks page — the check should show up after it has run at least once.

---

## Optional: Deploy only from GitHub Actions (no Vercel build on every push)

If you prefer **not** to have Vercel build on every push and instead want **only** GitHub Actions to trigger a deploy (after CI passes), you can:

1. Create a **Deploy Hook** in Vercel: Project → Settings → Git → **Deploy Hooks** → hook for “Production” or “main”.
2. Add a job in your GitHub Actions workflow that runs **only on push to `main`** and **only when the build job succeeds**, and in that job call the hook:  
   `curl -X POST "https://api.vercel.com/v1/integrations/deploy/…"`  
   (Use the hook URL from Vercel; store it as a secret, e.g. `VERCEL_DEPLOY_HOOK_URL`.)
3. In Vercel, **pause** or **disable** automatic deployments from the Git integration so the only deploy is the one triggered by the hook.

That way there is a single build path: CI in Actions → if pass, trigger Vercel via hook. For most people, **Deployment Checks** (first approach) are simpler and keep your current “Vercel builds on push” behavior while making CD wait for CI.
