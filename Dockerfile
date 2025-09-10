FROM openjdk:25-slim
WORKDIR /app
COPY target/code_challenge-0.0.1-SNAPSHOT.jar app.jar
CMD ["java", "-jar", "app.jar"]