# The Dockerized Java Lab: Architecture & Concepts

Before writing any code, we must understand the tools and terms we are using. This document breaks down the "What", "Why", and "How" of our Java playground.

---

## 🏗 The Architecture
We are building a **Single-Endpoint Microservice**.
It listens for HTTP requests and returns JSON. It runs inside a Docker container.

### The 4 Key Files

| File | Analogy in Node.js | Role |
| :--- | :--- | :--- |
| **`pom.xml`** | `package.json` | **Project Object Model**. It lists dependencies (libraries like Spring Boot) and build instructions. |
| **`DemoApp.java`** | `index.js` / `server.js` | **Entry Point**. The file that starts the server. |
| **`ApiController.java`** | `routes/api.js` | **Controller**. Defines the URL endpoints (`/api/data`) and the logic to return data. |
| **`Dockerfile`** | `Dockerfile` | **The Recipe**. Instructions for Docker on how to turn these files into a running application. |

---

## 📚 Key Terminology Explained

### 1. Maven (`pom.xml`)
*   **What it is:** The Build Tool and Package Manager for Java.
*   **What it does:**
    *   **Dependency Management:** It downloads libraries (JAR files) from the internet (Maven Central) effectively like `npm install`.
    *   **Build Lifecycle:** It handles compiling (`javac`), testing, and packaging code into a binary.
*   **Why we need it:** Java code must be *compiled* before it runs. You can't just run the source files like JS. Maven handles this compilation step.

### 2. JAR (`.jar`)
*   **What it is:** **J**ava **AR**chive.
*   **Node Analogy:** It's like bundling your entire Node app + node_modules into a single `.zip` file that is ready to execute.
*   **Usage:** Instead of running `node index.js`, you run `java -jar my-app.jar`.

### 3. Docker: Builder vs Runner (Multi-Stage Builds)
This is an industry-standard best practice to keep production images small and secure.

#### **Stage 1: The "Builder"**
*   **The Problem:** To *compile* Java code, you need the **JDK** (Java Development Kit) and **Maven**. These tools are heavy (hundreds of MBs).
*   **The Action:** We use a heavy Docker image (let's call it the "Construction Site") to download dependencies and compile our code into a lightweight `app.jar`.
*   **Node Analogy:** This is your `npm run build` step that generates the `dist/` folder.

#### **Stage 2: The "Runner"**
*   **The Problem:** We don't need the compiler (JDK) or Maven in production. We just need to *run* the compiled code.
*   **The Action:** We start fresh with a tiny, stripped-down Linux image (the "Runtime"). We copy **only** the `app.jar` from the Builder stage.
*   **The Result:** A tiny, secure image containing only what is strictly necessary to run the app.

---

## 🛠 The Implementation Plan

We will execute the following steps:

1.  **Create the Folder Structure**: Set up the directory for our demo.
2.  **Define Dependencies (`pom.xml`)**: Tell Maven we need "Spring Boot Web".
3.  **Write the Java Code**: Create the entry point and the API controller.
4.  **Create the Dockerfile**: Define the Multi-Stage build process.
5.  **Build & Run**: Execute the Docker commands to verify it works.

---

### Why this approach?
*   **Isolation**: No Java installed on your machine.
*   **Standardization**: This is exactly how Barclays (and most enterprises) deploy Java microservices.
*   **Learning**: You learn the lifecycle: Source Code -> Compile (Builder) -> Artifact (JAR) -> Run (Container).










