# Java Full-Stack Interview Roadmap (React Developer Perspective)

**Strategy:** Since your core strength is React, you are not expected to be a Java architect. However, you *are* expected to understand how the backend works, how to read Java code, and how to integrate with it.

**The Narrative:** "I am a Senior Frontend Engineer with Node.js experience. I haven't worked professionally with Java, but I understand OOP, API design, and backend architecture, and I'm eager to learn the Spring ecosystem."

---

## 🎯 Phase 1: The Core Language (Java vs JS)
*Goal: Read Java code without getting lost.*

1.  **Java Basics (The "Syntax" Check)**
    *   Strong Typing (int, boolean, String) vs JS dynamic typing.
    *   Primitive types vs Wrapper Classes (`int` vs `Integer`).
    *   Loops, Conditionals (same as JS).
    *   Exception Handling (`try-catch-finally`, Checked vs Unchecked exceptions).

2.  **OOP Principles (The "Mental Model")**
    *   **Classes & Objects**: Defining a blueprint vs creating an instance.
    *   **Inheritance**: `extends`, `super`.
    *   **Polymorphism**: Overloading (same method name, diff params) vs Overriding (same method, diff implementation).
    *   **Encapsulation**: `private`, `public`, `protected`, Getters/Setters (Lombok `@Data`).
    *   **Abstraction**: Abstract Classes vs Interfaces.

3.  **Collections Framework (The "Array/Object" replacement)**
    *   `List` / `ArrayList` (Like JS Array).
    *   `Map` / `HashMap` (Like JS Object/Map).
    *   `Set` / `HashSet` (Like JS Set).
    *   **Streams API**: The Java equivalent of `.map`, `.filter`, `.reduce`.

---

## 🚀 Phase 2: The Framework (Spring Boot)
*Goal: Understand how the API you fetch data from is built.*

4.  **Spring Boot Basics**
    *   What is Dependency Injection (DI) & Inversion of Control (IoC)? (The "Magic" of Spring).
    *   **Annotations** (The decorators):
        *   `@SpringBootApplication`
        *   `@Component`, `@Service`, `@Repository`.
        *   `@Autowired` (injecting dependencies).

5.  **Building REST APIs**
    *   `@RestController`: Making a class an API handler.
    *   `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`.
    *   `@RequestBody`, `@PathVariable`, `@RequestParam` (Reading inputs).
    *   **DTOs (Data Transfer Objects)**: Defining the shape of data sent to the React frontend.

---

## 🗄️ Phase 3: The Data Layer (JPA / Hibernate)
*Goal: How Java talks to the database.*

6.  **Spring Data JPA**
    *   `@Entity`: Mapping a Java class to a DB table.
    *   `@Id`, `@GeneratedValue`: Primary keys.
    *   `JpaRepository`: Magic interfaces that give you `.save()`, `.findAll()`, `.findById()` for free.
    *   **Relationships**: `@OneToMany`, `@ManyToOne` (Connecting Tables).

---

## 🏗️ Phase 4: Full-Stack Integration
*Goal: Connecting your React world to the Java world.*

7.  **Authentication & Security**
    *   **JWT in Java**: How Spring Security intercepts requests to check tokens.
    *   CORS configuration (Allowing your React localhost to talk to Java).

8.  **Build Tools**
    *   **Maven** (or Gradle): The `package.json` of Java.
    *   `pom.xml`: Where dependencies live.

---

## ✅ The "Honest" Interview Checklist

When asked about Java, you should confidently be able to say:

- [ ] "I understand the difference between **Primitives** and **Objects**."
- [ ] "I know how **OOP** concepts like Inheritance and Polymorphism apply in code."
- [ ] "I can use **Streams** to filter and map lists (similar to JS arrays)."
- [ ] "I understand how **Spring Boot** uses **Dependency Injection** to wire components."
- [ ] "I can read a **Controller** to see what endpoints exist and what JSON they return."
- [ ] "I understand **Entities** and **Repositories** are for database access."

