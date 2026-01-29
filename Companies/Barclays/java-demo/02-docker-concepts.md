# Dockerizing Java: Concepts & Plan

We are about to write the `Dockerfile`. This file tells Docker exactly how to build and run our application. Since we want a professional, "Barclays-grade" setup, we are using a **Multi-Stage Build**.

---

## 📚 Key Terminology Explained

### 1. Base Image (`FROM ...`)
*   **Concept**: You never start from scratch. You start from an existing OS image that has tools installed.
*   **The "Builder" Base**: `maven:3.8.5-openjdk-17`.
    *   This is a heavy Linux image that comes pre-installed with the Java Compiler (`javac`) and Maven (`mvn`).
*   **The "Runner" Base**: `openjdk:17-jdk-slim`.
    *   This is a tiny Linux image that *only* has the Java Runtime (JRE). It cannot compile code, but it can run compiled code.

### 2. Working Directory (`WORKDIR /app`)
*   **Concept**: "cd /app". All subsequent commands happen inside this folder within the container.

### 3. Copying Files (`COPY source dest`)
*   **Concept**: Moving files from your laptop (host) into the container.
*   **Strategy**: We copy `pom.xml` first, then the source code. This leverages Docker's layer caching (if code changes but pom doesn't, we don't re-download dependencies).

### 4. Build Command (`RUN mvn package`)
*   **Concept**: Running a shell command inside the container.
*   **Action**: `mvn clean package -DskipTests`.
    *   `clean`: Delete old build files.
    *   `package`: Compile and zip into a `.jar`.
    *   `-DskipTests`: Don't run unit tests (saves time for this demo).

### 5. Artifact Handoff (`COPY --from=build ...`)
*   **Concept**: The magic of multi-stage builds. We reach *back* into the first stage ("build") and grab the generated `.jar` file, discarding everything else (the source code, Maven, the 500MB of dependencies).

---

## 🛠 The Implementation Plan

We will create a single file named `Dockerfile` in `Barclays/java-demo/`.

### Stage 1: Build
1.  Start from `maven` image.
2.  Copy `pom.xml` and download dependencies.
3.  Copy `src` folder.
4.  Run `mvn package` to create `app.jar`.

### Stage 2: Run
1.  Start from `openjdk-slim` image.
2.  Copy `app.jar` from Stage 1.
3.  Expose Port 8080.
4.  Command: `java -jar app.jar`.

---

## ✅ Why this matters for the interview?
When they ask "Do you know Docker?", you can say:
> "Yes, I usually use **multi-stage builds** for my Java apps. I use a Maven image to compile the JAR, then copy it to a slim Alpine or JDK image to keep the production container small and secure."

This answer is an instant "Hire" signal for DevOps awareness.








