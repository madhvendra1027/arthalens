# services/api/Dockerfile
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/*.jar app.jar
RUN addgroup -S arthalens && adduser -S arthalens -G arthalens
USER arthalens
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
