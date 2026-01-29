# Practical DevOps for Frontend Engineers

**Context**: The job requires "Creation of docker images" and "Deployment using CI/CD Pipelines." You are not a DevOps engineer, but you need to know how to containerize your React app and automate its deployment.

---

## 🐋 1. Docker: "Works on My Machine" -> "Works Everywhere"

### Concept
Docker packages your application (code + dependencies + OS settings) into a "Image." This image runs identically on your laptop, a co-worker's laptop, and the production server.

### The `Dockerfile`
This recipe tells Docker how to build your image. Here is a standard production-ready React Dockerfile.

```dockerfile
# Stage 1: Build the React App
# Use a lightweight Node.js image
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package.json first (to cache dependencies)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the app (outputs to /dist or /build)
RUN npm run build

# Stage 2: Serve with Nginx
# We don't need Node.js in production, just a web server
FROM nginx:alpine

# Copy built assets from Stage 1 to Nginx folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (standard web port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Key Commands
*   **Build**: `docker build -t my-react-app .` (Create the image).
*   **Run**: `docker run -p 3000:80 my-react-app` (Run image, map laptop port 3000 to container port 80).
*   **Stop**: `docker stop <container-id>`.

---

## 🔄 2. CI/CD Pipelines (The Automation)

**CI (Continuous Integration)**: "Test and Build automatically."
**CD (Continuous Deployment)**: "Release to server automatically."

### Typical Pipeline Flow (GitLab CI / GitHub Actions)

1.  **Trigger**: You push code to `main` branch.
2.  **Job 1: Install & Lint**
    *   Runs `npm ci`
    *   Runs `npm run lint`
    *   *Fails pipeline if code is messy.*
3.  **Job 2: Test**
    *   Runs `npm test`
    *   *Fails pipeline if bugs are found.*
4.  **Job 3: Build & Dockerize**
    *   Runs `npm run build`
    *   Runs `docker build ...`
    *   Pushes Docker Image to a Registry (like Docker Hub or AWS ECR).
5.  **Job 4: Deploy**
    *   Tells the server (Kubernetes/AWS) to pull the new image and restart.

### Example: GitHub Actions Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy React App

on:
  push:
    branches: [ "main" ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install & Test
        run: |
          npm ci
          npm run test
      
      - name: Build
        run: npm run build

      - name: Build & Push Docker Image
        run: |
          docker build -t my-app .
          # (Login and Push commands would go here)
```

---

## ☁️ 3. Deployment Concepts

### "Internal / External Cloud"
The JD mentions this. It usually means:
*   **AWS (External)**: Using S3 + CloudFront (for static sites) or ECS/EKS (for Docker containers).
*   **Private Cloud (Internal)**: Companies like Barclays often have their own data centers running OpenShift or Kubernetes.
    *   **Implication for you**: You won't be FTPing files. You will push to Git, and the "Pipeline" does the rest.

### Micro-Frontends Deployment
Since the JD mentions Micro-frontends:
*   Each "micro-app" (Header, Dashboard, Settings) has its **own** repository and **own** pipeline.
*   They are built independently.
*   They are composed together at runtime (using Webpack Module Federation) or build time.

---

## ✅ Interview Checklist: DevOps for Frontend

- [ ] **Docker**: Can you explain multi-stage builds? (Stage 1 builds JS, Stage 2 serves HTML/CSS with Nginx to keep image small).
- [ ] **CI/CD**: Can you describe a standard pipeline? (Lint -> Test -> Build -> Deploy).
- [ ] **Nginx**: Do you know it's a web server used to serve static React files and handle routing (try_files for SPA)?
- [ ] **Caching**: Do you understand how hashed filenames (`main.a1b2c.js`) allow long-term caching?

