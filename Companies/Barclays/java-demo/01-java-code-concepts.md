# Writing the Java Code: Concepts & Architecture

We are now ready to write the actual application logic. In the Java/Spring world, this is typically split into two distinct parts:
1.  **The Application Entry Point** (Boots up the server).
2.  **The Controller** (Defines the API routes).

---

## 📚 Key Terminology Explained

### 1. Annotations (`@SomeName`)
*   **Concept**: Metadata that you add to classes or methods to tell Spring to "do something special."
*   **Analogy**: Think of them like Decorators in TypeScript/Angular, or Higher-Order Components in React.
*   **Key Annotations we will use**:
    *   `@SpringBootApplication`: "This class is the starting point."
    *   `@RestController`: "This class handles HTTP requests."
    *   `@GetMapping("/url")`: "Run this function when a GET request hits this URL."

### 2. Package (`package com.example.demo;`)
*   **Concept**: A namespace to organize code.
*   **Analogy**: Java's version of folders. Every file must declare which package (folder) it lives in at the very top.

### 3. Static Main Method (`public static void main...`)
*   **Concept**: The absolute first line of code that runs.
*   **Analogy**: The first line of `index.js` that calls `app.listen()`.

### 4. `Map<String, Object>`
*   **Concept**: A key-value pair collection.
*   **Analogy**: A JavaScript Object `{ key: "value" }`. Since Java is strictly typed, we often use `Map` to represent generic JSON objects if we don't want to create a specific Class for them.

---

## 🛠 The Implementation Plan

We will create two files in `src/main/java/com/example/demo/`:

### File 1: `DemoApplication.java` (The Server)
*   **Responsibility**: To start the Spring Boot application.
*   **Code Structure**:
    ```java
    @SpringBootApplication
    public class DemoApplication {
        public static void main(String[] args) {
            SpringApplication.run(DemoApplication.class, args);
        }
    }
    ```
    *   *Translation*: "Import Spring. Start the server using the configuration in this class."

### File 2: `ApiController.java` (The Route)
*   **Responsibility**: To listen for `GET /api/hello`.
*   **Logic**: Return a simple JSON response: `{"message": "Hello from Java!", "status": "Success"}`.
*   **Code Structure**:
    *   Annotate class with `@RestController`.
    *   Annotate method with `@GetMapping`.
    *   Return a `Map` (which Spring automatically converts to JSON).

---

## ✅ Why this separation?
In Express.js, you might put `app.listen` and `app.get` in the same file. In Java, we separate **Configuration** (`DemoApplication`) from **Business Logic** (`ApiController`) for better organization and testing.








