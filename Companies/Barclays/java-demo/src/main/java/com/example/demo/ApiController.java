package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

// @RestController: Tells Spring "This class handles web requests and returns JSON"
// It combines @Controller and @ResponseBody
@RestController
@RequestMapping("/api") // Base URL for all methods in this class: /api
public class ApiController {

    // GET /api/hello
    @GetMapping("/hello")
    public Map<String, String> sayHello() {
        // We use a HashMap to represent a JSON object
        // JS Equivalent: return { message: "Hello...", status: "Up" }
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello from Dockerized Java!");
        response.put("status", "System is Up");
        response.put("role", "Full Stack Developer");
        
        return response;
    }
}








