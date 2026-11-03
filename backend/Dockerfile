FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /workspace

COPY .mvn ./.mvn
COPY mvnw pom.xml ./
RUN chmod +x ./mvnw && ./mvnw -B -q dependency:go-offline

COPY src ./src
RUN ./mvnw -B -q package -DskipTests && \
    cp target/*.jar /workspace/app.jar

FROM eclipse-temurin:21-jre-alpine AS runner

WORKDIR /app

# 与宿主机 /data/luokai-blog/uploads 持久化目录保持相同的 UID/GID (1001:1001)
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk add --no-cache tzdata wget && \
    addgroup -S -g 1001 spring && \
    adduser -S -u 1001 -G spring spring && \
    mkdir -p /app/uploads && \
    chown -R spring:spring /app

ENV TZ=Asia/Shanghai
ENV SERVER_PORT=8080
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -Dfile.encoding=UTF-8"

COPY --from=builder --chown=spring:spring /workspace/app.jar /app/app.jar

USER spring

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=5s --retries=6 \
  CMD wget -qO- http://127.0.0.1:8080/actuator/health | grep -q '"status":"UP"' || exit 1

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
