package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication is a convenience annotation that adds:
// 1. @Configuration: Tags the class as a source of bean definitions.
// 2. @EnableAutoConfiguration: Tells Spring Boot to start adding beans based on classpath settings.
// 3. @ComponentScan: Tells Spring to look for other components/controllers in this package.
@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		// This line boots up the embedded Tomcat server
		SpringApplication.run(DemoApplication.class, args);
		System.out.println("🚀 Java Server Started on Port 8080");
	}

}








