---
title: "Docker in Production: Lessons I Learned the Hard Way"
date: "2026-01-10"
excerpt: "Docker looks simple in tutorials. In production, it's a different story. Here are the mistakes I've made and the patterns that actually work when running containers at scale."
description: "Practical guide to running Docker in production. Covers image optimization, multi-stage builds, security hardening, health checks, logging, and orchestration patterns from real-world experience."
keywords: "Docker production, Docker best practices, container security, multi-stage Docker build, Docker health checks, Docker logging, Kubernetes deployment, container orchestration"
tags: ["Docker", "DevOps", "Cloud", "Backend", "Tutorial"]
author: "Subhadeep Datta"
featured_image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&h=600&fit=crop"
---

## 🐳 Introduction: Docker Isn't Just "Build and Ship"

Docker is one of those tools that seems simple on day one. You write a Dockerfile, run `docker build`, push the image, and congratulate yourself. Then production happens.

Containers crash at 3 AM. Images are 2GB. Secrets end up baked into layers. Logs vanish. Deployments take 20 minutes because your CI pipeline rebuilds everything from scratch.

I've made all these mistakes across multiple projects at Noisiv Consulting. This article is the distilled version of what actually works when you're running containers in production and need them to be fast, secure, and reliable.

---

## 📦 1. Your Docker Images Are Too Big

The most common issue. You start with `node:18` as your base image. That's 900MB before you've added a single line of your own code.

### The Problem

```dockerfile
# ❌ 1.2GB image
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]
```

Big images mean:
- Slow CI/CD pipelines (push/pull takes minutes)
- More attack surface (more packages = more CVEs)
- Higher storage and bandwidth costs
- Slower cold starts in Kubernetes

### The Fix: Multi-Stage Builds

```dockerfile
# ✅ ~150MB image
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Key techniques:

- Use `alpine` base images (5MB vs 900MB)
- Use `npm ci` instead of `npm install` (deterministic, faster)
- Use `--only=production` to skip devDependencies
- Copy only the build output, not the entire source
- Set `USER node` — never run as root

**Impact:** 1.2GB → 150MB. CI deploy time: 8 minutes → 90 seconds.

---

## 🔒 2. Security: Stop Baking Secrets Into Images

This one is scary common. I've seen API keys, database passwords, and even private certificates committed inside Docker images.

### What NOT to Do

```dockerfile
# ❌ Never do this
ENV DATABASE_URL=postgres://admin:supersecret@db:5432/myapp
ENV API_KEY=sk-live-abc123
```

Anyone who pulls your image can run `docker inspect` and see every environment variable.

### The Fix

Pass secrets at runtime, never at build time:

```yaml
# docker-compose.yml
services:
  api:
    image: myapp:latest
    env_file:
      - .env.production  # NOT committed to git
    secrets:
      - db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

In Kubernetes, use Secrets or a vault:

```yaml
# k8s secret reference
env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: database-url
```

### Other Security Best Practices

- **Scan images for vulnerabilities**: `docker scout cves myapp:latest` or use Trivy
- **Use read-only filesystems**: `--read-only` flag prevents runtime modifications
- **Don't run as root**: Always add `USER node` (or another non-root user)
- **Pin your base image versions**: `node:18.19.0-alpine` not `node:latest`

---

## 🏥 3. Health Checks: Know When Your Container Is Actually Healthy

A running container isn't necessarily a healthy container. Your process might be up but stuck in a deadlock, out of memory, or unable to reach the database.

### The Problem

Without health checks, your orchestrator (Docker Compose, ECS, Kubernetes) has no idea if your app is functioning. It sees the process is alive and assumes everything is fine.

### The Fix

Add a HEALTHCHECK to your Dockerfile:

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

And create a proper health endpoint:

```javascript
// health.js — don't just return 200
app.get("/health", async (req, res) => {
  try {
    // Check database connectivity
    await db.query("SELECT 1");

    // Check Redis connectivity
    await redis.ping();

    res.status(200).json({
      status: "healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: error.message,
    });
  }
});
```

A good health check verifies your dependencies, not just that your process is alive.

---

## 📝 4. Logging: Where Do Your Logs Go?

In development, `console.log` works fine. In production with 20 containers, good luck finding anything.

### The Pattern

Log to stdout/stderr (not files). Let the orchestrator handle collection.

```javascript
// ✅ Structured JSON logging
const log = (level, message, meta = {}) => {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    service: "api",
    ...meta,
  };
  console.log(JSON.stringify(entry));
};

// Usage
log("info", "Order created", { orderId: "abc-123", userId: "user-456" });
log("error", "Payment failed", { orderId: "abc-123", error: err.message });
```

### Why Structured Logging Matters

- **Searchable**: find all errors for a specific user in seconds
- **Parseable**: tools like Elasticsearch, Datadog, and CloudWatch can index your logs automatically
- **Consistent**: every log entry has the same shape, making dashboards trivial

### Production Stack

```
Container (stdout) → Docker log driver → Fluentd/Filebeat → Elasticsearch → Kibana
```

Or if you're on AWS: `Container → CloudWatch Logs → CloudWatch Insights`

---

## 🚀 5. Deployment Patterns That Actually Work

### Zero-Downtime Deployments

Never stop the old container before the new one is ready. Use rolling updates:

```yaml
# docker-compose with rolling update strategy
services:
  api:
    image: myapp:latest
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first   # Start new before stopping old
      restart_policy:
        condition: on-failure
```

### Graceful Shutdown

Handle `SIGTERM` properly so in-flight requests aren't dropped:

```javascript
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Starting graceful shutdown...");

  // Stop accepting new connections
  server.close(async () => {
    // Finish in-flight requests (30s timeout)
    await db.end();
    await redis.disconnect();
    console.log("Graceful shutdown complete.");
    process.exit(0);
  });

  // Force exit after 30 seconds
  setTimeout(() => {
    console.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 30000);
});
```

### Docker Compose for Local Parity

Keep your local and production environments as close as possible:

```yaml
# docker-compose.yml
services:
  api:
    build: .
    ports: ["3000:3000"]
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
```

---

## 🧭 My Docker Production Checklist

Before deploying any container to production, I run through this:

| Check | Why | How |
|-------|-----|-----|
| Image < 200MB | Fast deploys, less attack surface | Multi-stage build + alpine |
| No secrets in image | Security | Runtime env vars + secrets manager |
| Health check defined | Auto-recovery on failure | HEALTHCHECK + /health endpoint |
| Structured logging | Debuggability at scale | JSON to stdout |
| Non-root user | Security | `USER node` in Dockerfile |
| Graceful shutdown | No dropped requests | Handle SIGTERM |
| Pinned base images | Reproducible builds | Use exact version tags |
| .dockerignore exists | Smaller build context | Exclude node_modules, .git, tests |

---

## 🎯 Conclusion

Docker in production is less about the technology and more about discipline. The patterns aren't complicated — they're just easy to skip when you're moving fast.

Start with the image size. Then add health checks. Then fix your logging. Each improvement compounds. A well-configured container setup saves hours of debugging and makes 3 AM incidents far less likely.

The best Docker setup is one you don't have to think about.

---

## 📚 Key Takeaways

- **Multi-stage builds** cut image sizes by 80-90%
- **Never bake secrets** into Docker images — use runtime injection
- **Health checks** should verify dependencies, not just process liveness
- **Structured JSON logging** to stdout makes debugging at scale possible
- **Graceful shutdown** handling prevents dropped requests during deploys
