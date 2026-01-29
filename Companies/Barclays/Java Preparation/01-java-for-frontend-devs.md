# Java Cheat Sheet for React Developers

**Context**: You are a React expert working in a Java/Spring Boot environment. You need to read backend code to understand APIs, run the server locally, and maybe tweak simple logic.

---

## 1. The Anatomy of a Spring Boot API
*Mapping Backend Code to Frontend Usage.*

### The Controller (`MyController.java`)
This is where the API endpoints are defined. It's the most important file for you.

```java
@RestController
@RequestMapping("/api/users") // Base URL: http://localhost:8080/api/users
@CrossOrigin(origins = "http://localhost:3000") // Allows your React app to call this
public class UserController {

    @Autowired
    private UserService userService; // Dependency Injection (like importing a module)

    // GET /api/users/123
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        UserDTO user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    // POST /api/users
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDto) {
        // @RequestBody maps the JSON you sent from React to a Java Object
        return ResponseEntity.ok(userService.save(userDto));
    }
}
```

**React Dev Translation:**
*   `@GetMapping("/{id}")` -> `fetch('/api/users/' + id)`
*   `@RequestBody UserDTO userDto` -> The JSON payload you send in `body: JSON.stringify({...})`.
*   `UserDTO` -> The TypeScript interface you need to create on the frontend.

---

## 2. Reading Data Structures (DTOs & Entities)
*Understanding the data shape.*

### DTO (Data Transfer Object)
This defines exactly what the JSON response looks like.

```java
// UserDTO.java
@Data // Lombok magic: auto-generates getters, setters, toString
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private List<String> roles; // Arrays become Lists
}
```

**React Equivalent (TypeScript Interface):**
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}
```

---

## 3. Common Java "Weirdness" Explained

| Java Concept | JS Equivalent / Explanation |
| :--- | :--- |
| `public static void main(String[] args)` | The entry point. Like `index.js` or `App.tsx`. |
| `System.out.println("Log")` | `console.log("Log")` |
| `List<String> items = new ArrayList<>();` | `const items = [];` |
| `Map<String, Integer> map = new HashMap<>();` | `const map = {};` or `new Map()` |
| `item.getName()` | `item.name` (Java uses getters, rarely public fields) |
| `stream().filter(x -> x > 5).collect(Collectors.toList())` | `.filter(x => x > 5)` |
| `Optional<User>` | A box that might contain a User or might be null. Forces you to check. |
| `Maven` / `pom.xml` | `npm` / `package.json` |

---

## 4. Running the Backend Locally
*How to start the server so you can develop against it.*

1.  **Install Java (JDK)**: Ensure you have JDK 17 or 21 (common standards). `java -version`.
2.  **Build the Project**:
    *   Command Line: `./mvnw clean install` (Maven wrapper) or `./gradlew build` (Gradle wrapper).
    *   *Translation*: `npm install && npm run build`.
3.  **Run the Server**:
    *   Command Line: `./mvnw spring-boot:run`.
    *   *Translation*: `npm start`.
4.  **Check Port**: Usually starts on `localhost:8080`.
    *   Check `src/main/resources/application.properties` for `server.port`.

---

## 5. Debugging 101
*When the API fails, check these things:*

1.  **CORS Errors**: If Chrome blocks the request, check the Controller for `@CrossOrigin` or ask a backend dev to configure the global WebConfig.
2.  **500 Internal Server Error**: Check the Java console/terminal.
    *   Look for "Exception". e.g., `NullPointerException` (Backend tried to read a property of `null`).
3.  **400 Bad Request**: You sent the wrong data.
    *   Check the DTO fields. Did you send a string where they expected a number?
    *   Did you send `userName` (camelCase) but they expected `user_name` (snake_case)? (Check `@JsonProperty` annotations in the DTO).

---

## 6. Interview "Power Phrases"
*Show you know enough to be dangerous.*

*   "I'm comfortable running the Spring Boot application locally to unblock myself."
*   "I can read the Controller and DTO classes to generate my TypeScript interfaces automatically or manually."
*   "I understand how to check `application.properties` for environment configurations like DB URLs or ports."
*   "I've worked with Swagger/OpenAPI, which usually makes manual inspection of Controllers unnecessary."

