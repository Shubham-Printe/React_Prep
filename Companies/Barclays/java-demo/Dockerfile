# ==============================================================================
# STAGE 1: THE BUILDER (Construction Site)
# ==============================================================================
# We start with a full Maven image (Includes Java JDK + Maven)
# "AS build" names this stage so we can refer to it later
FROM maven:3.8.5-openjdk-17 AS build

# Set the working directory inside the builder container
WORKDIR /app

# 1. OPTIMIZATION: Copy only pom.xml first
# This allows Docker to cache the "download dependencies" step
COPY pom.xml .

# Download dependencies (and fail if they are missing).
# This layer will be cached unless pom.xml changes.
RUN mvn dependency:go-offline -B

# 2. Copy the actual source code
COPY src ./src

# 3. Build the application
# -clean: remove previous build artifacts
# -package: compile code and zip it into a JAR
# -DskipTests: speed up build by skipping unit tests
RUN mvn clean package -DskipTests

# Result: We now have a file at /app/target/demo-0.0.1-SNAPSHOT.jar

# ==============================================================================
# STAGE 2: THE RUNNER (Production Environment)
# ==============================================================================
# We start fresh with a tiny image (Alpine Linux + Java Runtime only)
FROM openjdk:17-jdk-slim

# Set working directory for the running app
WORKDIR /app

# 4. HANDOFF: Copy ONLY the JAR file from the "build" stage
# We leave behind the source code, Maven, and the 500MB of dependencies
COPY --from=build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar

# 5. Tell Docker which port this app listens on (Documentation only, usually)
EXPOSE 8080

# 6. The Command to run when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]








