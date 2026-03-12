# Deploying a React (Static) App to AWS S3 — Step-by-Step

This folder contains a **detailed, step-wise process** for hosting a static React app (e.g. Vite build output in `dist/`) on **AWS S3**, with considerations an experienced engineer would weigh at each decision point. By the end you will have used S3 for storage, optional CloudFront for HTTPS and CDN, and GitHub Actions for deploy-after-CI.

---

## Table of contents

1. [Overview and prerequisites](#1-overview-and-prerequisites)
2. [Step 1: AWS account and region](#2-step-1-aws-account-and-region)
3. [Step 2: Create the S3 bucket](#3-step-2-create-the-s3-bucket)
4. [Step 3: Bucket policy for public read](#4-step-3-bucket-policy-for-public-read)
5. [Step 4: Enable static website hosting](#5-step-4-enable-static-website-hosting)
6. [Step 5: Upload the build](#6-step-5-upload-the-build)
7. [Step 6: Add CloudFront (HTTPS and CDN)](#7-step-6-add-cloudfront-https-and-cdn)
8. [Step 7: Automate deploy with GitHub Actions](#8-step-7-automate-deploy-with-github-actions)
9. [Step 8: Custom domain (optional)](#9-step-8-custom-domain-optional)

---

## 1. Overview and prerequisites

**What you’ll have when done**

- An S3 bucket holding your built static files (`index.html`, JS, CSS, assets).
- Static website hosting enabled so the bucket is reachable via an S3 website URL (HTTP).
- Optionally: a CloudFront distribution in front of S3 for HTTPS, caching, and (later) custom domain.
- Optionally: a GitHub Actions job that builds the app and deploys to S3 (and invalidates CloudFront) after CI passes.

**Prerequisites**

- An AWS account.
- A React (or any static) app that builds to a single directory (e.g. `dist/`).
- Basic familiarity with AWS Console (or CLI). No prior S3/CloudFront experience required.

**Why S3 (and not only Vercel/Amplify)?**

- You learn how **object storage**, **bucket policies**, and **CDN** work in a real cloud environment.
- Same patterns apply to other clouds (e.g. Azure Blob + CDN).
- Useful for interviews and for environments where “connect Git and go” isn’t an option (e.g. air-gapped or strict compliance).

---

## 2. Step 1: AWS account and region

**What to do**

- Ensure you have an AWS account and can sign in to the AWS Console.
- Choose the **region** where you will create the S3 bucket (e.g. `us-east-1`, `ap-south-1`).

**Considerations**

| Decision | Why it matters |
|----------|----------------|
| **Region** | **Latency:** Pick a region close to most of your users so the first byte is faster. **Compliance / data residency:** Some orgs require data to stay in a specific region or country. **Cost:** Data transfer and some services have regional pricing; often “default” regions (e.g. `us-east-1`) have more features and sometimes cheaper. |
| **One region first** | Keep the first deployment in a single region. Multi-region (e.g. failover, global low latency) adds complexity (Route53, multiple buckets or replication); do that only when you need it. |

**No code or config yet** — this is purely planning. Note your chosen region; you’ll use it when creating the bucket.

---

## 3. Step 2: Create the S3 bucket

**What to do**

1. In AWS Console: **S3** → **Create bucket**.
2. **Bucket name:** Globally unique across all AWS accounts (e.g. `my-app-static-prod`, or `www.myapp.com` if you’ll use it as origin for a custom domain). Use lowercase, no spaces; avoid dots if you might use virtual-hosted-style URLs later to reduce SSL quirks.
3. **Region:** Same as in Step 1.
4. **Block Public Access:** By default all four are on. For **static website hosting** we will allow public read via a **bucket policy** (next step). So you will **uncheck “Block all public access”** and acknowledge the warning. The important point: we are not “opening the whole bucket”; we will restrict access in the policy to `s3:GetObject` only.
5. **Object Ownership:** Prefer **“Bucket owner enforced”** (ACLs disabled). Simpler and recommended for new buckets; no need for bucket-owner-full-control ACLs on uploads.
6. **Bucket Versioning (optional):** Turn on if you want to keep previous object versions (rollback, audit). Adds storage cost; you can enable later.
7. **Default encryption:** Leave **SSE-S3** on so objects are encrypted at rest. No downside for a static site.
8. Create the bucket.

**Considerations**

| Decision | Why it matters |
|----------|----------------|
| **Unblocking public access** | S3’s “Block Public Access” is a safety net. For a **public** static site we intentionally allow public read. We do it in a controlled way with a bucket policy that only allows `GetObject` (read), not list or write. Never grant `s3:*` or `ListBucket` to `*` for a web bucket. |
| **Bucket name = future URL?** | If you use the S3 **website endpoint** only, the URL will be `http://<bucket>.s3-website.<region>.amazonaws.com`. The bucket name is visible there. If you later put CloudFront in front, the bucket name can be internal (e.g. `my-app-static`) and the public URL is the CloudFront (or custom) domain. |
| **One bucket per environment** | For production vs staging, use separate buckets (e.g. `my-app-static-prod`, `my-app-static-staging`) so policies and lifecycle rules stay clear and one mistake doesn’t affect the other. |

---

## 4. Step 3: Bucket policy for public read

**What to do**

1. Open your bucket → **Permissions** tab.
2. **Bucket policy** → **Edit** → paste a policy that allows public `GetObject` only.

Example (replace `YOUR_BUCKET_NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

3. Save. The `/*` means “objects inside the bucket”, not the bucket resource itself (so listing the bucket is not allowed).

**Considerations**

| Decision | Why it matters |
|----------|----------------|
| **Principal "*"** | Anyone on the internet can read objects. That’s required for a public website. We don’t grant `ListBucket`, `PutObject`, or `DeleteObject`, so they can’t list contents or change anything. |
| **Tighten later with CloudFront** | When you add CloudFront, you can switch to an **Origin Access Identity (OAI)** or **Origin Access Control (OAC)** so only CloudFront can read from S3. Then you remove `Principal "*"` and allow only the CloudFront principal. That way the bucket isn’t directly exposed; all traffic goes through CloudFront. Do that in Step 6 when you create the distribution. |
| **Separate prod vs staging** | Use different buckets (and policies) for prod and staging so a bad policy change in staging doesn’t affect production. |

---

## 5. Step 4: Enable static website hosting

**What to do**

1. Bucket → **Properties** tab.
2. **Static website hosting** → **Edit** → **Enable**.
3. **Hosting type:** “Host a static website”.
4. **Index document:** `index.html` (so requests to `/` or `/some-path` can be served `index.html`; for the root, S3 will serve `index.html` as index).
5. **Error document:** Set to `index.html` as well. This is important for **client-side routing** (e.g. React Router): when a user hits `/products/123` directly or refreshes, S3 would otherwise return 404. With error document `index.html`, S3 serves the app shell and the router can handle the route.
6. Save. Note the **Bucket website endpoint** (e.g. `http://YOUR_BUCKET_NAME.s3-website-us-east-1.amazonaws.com`).

**Considerations**

| Decision | Why it matters |
|----------|----------------|
| **Error document = index.html** | For a single-page app (SPA), every path that doesn’t match a real file should serve the same `index.html`. Otherwise deep links or refresh on `/products/123` return 404. Some setups use **custom error responses** in CloudFront (403/404 → 200 with `index.html`); at the S3 level, the error document achieves a similar effect for direct S3 website access. |
| **HTTP only** | The S3 website endpoint is **HTTP only**. Browsers will show “Not secure” and many features (e.g. some APIs, service workers) expect HTTPS. For production you’ll put **CloudFront** in front and serve HTTPS (Step 6). |
| **No trailing slash** | S3 static hosting expects “index document” for directory-style requests; it doesn’t do full “directory listing” like a classic Apache server. Your build should emit `index.html` at the root and the error document covers 404s. |

---

## 6. Step 5: Upload the build

**What to do**

1. Build the app locally: `npm run build` (or `yarn build`). You should get a `dist/` (or similar) folder with `index.html`, JS, CSS, and assets.
2. Upload to S3. Two common ways:
   - **Console:** Bucket → **Objects** → **Upload** → drag the **contents** of `dist/` (so `index.html` is at the root of the bucket, not inside a `dist` folder).
   - **CLI:** From the project root,  
     `aws s3 sync dist/ s3://YOUR_BUCKET_NAME/ --delete`  
     The `--delete` removes objects in S3 that are no longer in `dist/`, so old files don’t linger.
3. Open the **Bucket website endpoint** in a browser. You should see your app. Test a deep link (e.g. `/some-route`) and refresh; the error document should serve the app.

**Considerations**

| Decision | Why it matters |
|----------|----------------|
| **Root of bucket = site root** | The URL path maps directly to object keys. `index.html` at the root is your homepage. If you upload a folder `dist/` as a prefix, your site would be at `.../dist/index.html` and routes would break. So upload the **contents** of `dist/` so that `index.html` is the root key. |
| **Cache control** | For **hashed filenames** (e.g. `main-abc123.js`), long cache is safe (e.g. `Cache-Control: max-age=31536000, immutable`). For **index.html**, use short or no-cache (e.g. `max-age=0` or `no-cache`) so users get the new HTML and new asset references after a deploy. You can set this in the CLI: `--cache-control "max-age=0,no-cache"` for `index.html` and `--cache-control "max-age=31536000,immutable"` for others, or in a later CI step. |
| **Content-Type** | S3 infers from file extension; usually `index.html` → `text/html`, `.js` → `application/javascript`. If you have non-standard extensions, set `Content-Type` on upload. |
| **First deploy = manual** | Doing one manual upload (or one CLI sync) confirms the bucket, policy, and hosting settings before you automate. Add automation in Step 7. |

---

## 7. Step 6: Add CloudFront (HTTPS and CDN)

**What to do**

1. **CloudFront** → **Create distribution**.
2. **Origin:**
   - **Origin domain:** Choose the **S3 website endpoint** (e.g. `YOUR_BUCKET.s3-website-us-east-1.amazonaws.com`), not the bucket’s general endpoint. Using the website endpoint keeps S3’s index and error document behavior.
   - **Name** auto-fills. **Protocol:** HTTP only (S3 website is HTTP).
3. **Default cache behavior:**
   - **Viewer protocol policy:** “Redirect HTTP to HTTPS” so users always get HTTPS.
   - **Allowed HTTP methods:** GET, HEAD, OPTIONS (no need for PUT/POST for a static site).
   - **Cache policy:** “CachingOptimized” or a custom policy. For `index.html` you want short TTL or no cache; for hashed assets, long TTL. You can refine with cache behaviors later (e.g. path pattern `/index.html` → short TTL, `*.js` → long TTL).
4. **Settings:**
   - **Default root object:** `index.html` (so `https://your-dist.cloudfront.net/` serves `index.html`).
   - **Custom error responses:** Add one for **HTTP 403** and one for **404**, both with **Response page path** `/index.html`, **HTTP response** 200. This gives your SPA correct behavior for direct/refresh on any path.
5. Create the distribution. Wait until **Enabled** (a few minutes). Test `https://YOUR_DISTRIBUTION_DOMAIN.cloudfront.net`.

**Considerations**

| Decision | Why it matters |
|----------|----------------|
| **Why CloudFront** | S3 website endpoint is HTTP only. CloudFront gives HTTPS (and free TLS via AWS), a global CDN (lower latency, less load on S3), and a single place to attach a custom domain and certificate (Step 8). |
| **Origin = S3 website endpoint** | Using the bucket’s **website endpoint** (not the REST endpoint) preserves index and error document behavior. If you used the REST endpoint, you’d have to handle 404s and index logic only in CloudFront. |
| **403 and 404 → 200 with index.html** | For SPAs, any path that doesn’t match a file (e.g. `/products/1`) returns 404 from S3. CloudFront can convert that to “200 + index.html” so the app loads and the router can render the route. Same for 403 (e.g. access denied). |
| **Invalidation** | When you deploy new content, CloudFront edge caches may still serve old files. You **invalidate** the distribution (e.g. `/*` or `/index.html`) so the next request fetches from origin. Invalidation has a cost; for small sites a single `/*` after each deploy is usually fine. We’ll add this to GitHub Actions in Step 7. |
| **Restricting S3 to CloudFront only** | After CloudFront works, you can lock the bucket so only CloudFront can read: use an **Origin Access Control (OAC)** in the distribution and a bucket policy that allows the CloudFront service principal. Then remove the public `GetObject` policy from Step 3. That way the bucket is no longer directly reachable; all traffic is via HTTPS through CloudFront. |

---

## 8. Step 7: Automate deploy with GitHub Actions

**What to do**

1. **IAM user for CI (or OIDC):**
   - Create an IAM user (e.g. `github-actions-deploy`) with **no console login**, only programmatic access.
   - Attach an inline or managed policy that allows:
     - `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` on your bucket (and optionally the staging bucket).
     - If using CloudFront: `cloudfront:CreateInvalidation` on your distribution.
   - Store the **Access Key ID** and **Secret Access Key** in GitHub: repo **Settings → Secrets and variables → Actions** (e.g. `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`). Optionally `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_CLOUDFRONT_DISTRIBUTION_ID` as repo variables.
2. **Workflow:** Add a **deploy** job that runs only on push to `main` (or your production branch), **after** your existing CI job (lint, test, build) succeeds:
   - Checkout, setup Node, install deps, build (or reuse the built artifact from the CI job).
   - Configure AWS credentials (e.g. `aws-actions/configure-aws-credentials@v4` with the secrets).
   - Run `aws s3 sync dist/ s3://YOUR_BUCKET/ --delete` (and optional `--cache-control` flags).
   - Run `aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"` (or `"/index.html"` if you want to invalidate only the HTML).
3. Ensure the deploy job **depends on** the CI job (e.g. `needs: [build-and-test]`) so you only deploy when tests and build pass.

**Considerations**

| Decision | Why it matters |
|----------|----------------|
| **Minimal IAM** | Grant only the permissions the workflow needs: S3 write (and list/delete for sync), and CloudFront invalidation. No `s3:*` or broad `*` resources. Use resource ARNs scoped to the specific bucket(s) and distribution. |
| **Secrets vs variables** | Credentials must be in **Secrets**. Bucket name, distribution ID, and region can be **Variables** (or hardcoded in the workflow) if they’re not sensitive. |
| **Deploy only after CI** | The deploy job should run only when the main branch’s CI (lint, test, build) has succeeded. Use `needs` and `if: github.ref == 'refs/heads/main'` (or your production branch). That keeps “deploy” as “deploy the version that passed CI.” |
| **Reuse build artifact** | To avoid building twice, your CI job can upload `dist/` as an artifact and the deploy job can download it and sync to S3. Alternatively, the deploy job can run `npm ci && npm run build` again; simpler but slower and duplicates build logic. |
| **Invalidation scope** | Invalidating `/*` clears all cached objects; simple but costs more at scale. Invalidating only `/index.html` (and maybe a few key paths) is cheaper; hashed assets can rely on long cache and new filenames after each build. |

---

## 9. Step 8: Custom domain (optional)

**What to do**

1. **Certificate:** In **AWS Certificate Manager (ACM)** (in **us-east-1** if the cert is for CloudFront), request a **public** certificate for your domain (e.g. `www.myapp.com` or `myapp.com`). Validate via DNS (add the CNAME record ACM gives you).
2. **CloudFront:** Edit your distribution → **Alternate domain names (CNAMEs):** add your domain. **Custom SSL certificate:** select the ACM certificate. Save.
3. **DNS:** In Route53 (or your DNS provider), add a **CNAME** (or **A/AAAA** with alias if Route53) pointing your domain to the CloudFront distribution domain (e.g. `d1234abcd.cloudfront.net`). CloudFront will then serve your app for that domain over HTTPS.

**Considerations**

| Decision | Why it matters |
|----------|----------------|
| **ACM in us-east-1** | CloudFront only uses certificates from **us-east-1**. If you created the cert in another region, you must request a new one in us-east-1 for CloudFront. |
| **www vs apex** | You can use `www.myapp.com`, `myapp.com`, or both. For apex (`myapp.com`), Route53 supports alias A/AAAA to CloudFront; other providers often need a CNAME flattening or similar. |
| **Redirect HTTP → HTTPS** | Already set in Step 6 with “Redirect HTTP to HTTPS” in the viewer protocol policy. |

---

## Quick reference

| Step | Outcome |
|------|---------|
| 1 | Region chosen. |
| 2 | S3 bucket created; public access unblocked; ownership and encryption set. |
| 3 | Bucket policy allows public `GetObject` only. |
| 4 | Static website hosting on; index and error = `index.html`. |
| 5 | Build uploaded; site works on S3 website URL (HTTP). |
| 6 | CloudFront in front; HTTPS; 403/404 → index.html. |
| 7 | GitHub Actions deploys to S3 and invalidates CloudFront after CI. |
| 8 | Custom domain and certificate attached to CloudFront. |

Each step above includes the **decision** and **experienced considerations** so you can reason about trade-offs and adapt the setup (e.g. staging bucket, different cache rules, or locking S3 to CloudFront only) as needed.
