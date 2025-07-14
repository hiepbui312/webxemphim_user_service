# 11. Deployment Architecture

## 11.1 Overview

Hệ thống WebXemPhim User Service hỗ trợ hai môi trường triển khai chính:
- **Local Development**: Sử dụng Docker Compose
- **Production**: Sử dụng Kubernetes

## 11.2 Local Development với Docker Compose

### 11.2.1 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Local Development                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   NestJS App    │  │   PostgreSQL    │  │     Redis       │  │
│  │   (Container)   │  │   (Container)   │  │   (Container)   │  │
│  │   Port: 3000    │  │   Port: 5432    │  │   Port: 6379    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                              │                                  │
│  ┌─────────────────┐         │         ┌─────────────────┐     │
│  │   RabbitMQ      │         │         │   Development   │     │
│  │   (Container)   │         │         │   Volumes       │     │
│  │   Port: 5672    │         │         │   (Live Reload) │     │
│  │   UI: 15672     │         │         │                 │     │
│  └─────────────────┘         │         └─────────────────┘     │
├─────────────────────────────────────────────────────────────────┤
│                    Docker Network                               │
│                webxemphim_dev_network                           │
└─────────────────────────────────────────────────────────────────┘
```

### 11.2.2 Docker Compose Files

**docker-compose.yml** (Production mode)
- Sử dụng Dockerfile với multi-stage build
- Tối ưu hóa cho production
- Không có volume mount cho source code

**docker-compose.dev.yml** (Development mode)
- Sử dụng Dockerfile.dev
- Volume mount cho live reload
- Debug port enabled (9229)
- Development dependencies included

**docker-compose.test.yml** (Testing mode)
- Isolated test environment
- Separate test database (port 5433)
- Separate Redis instance (port 6380)
- Separate RabbitMQ instance (port 5673)

### 11.2.3 Environment Variables

```bash
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=webxemphim_dev

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=admin
RABBITMQ_PASS=admin
```

### 11.2.4 Quick Start Commands

```bash
# Start development environment
make dev

# Start production environment
make start

# Run tests
make test

# View logs
make logs

# Stop all services
make stop

# Clean everything
make clean
```

## 11.3 Production Deployment với Kubernetes

### 11.3.1 Kubernetes Resources

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: webxemphim-user-service
  labels:
    app: webxemphim-user-service
    environment: production
```

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: webxemphim-user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: webxemphim/user-service:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: host
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### 11.3.2 Service & Ingress

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: user-service
  namespace: webxemphim-user-service
spec:
  selector:
    app: user-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
```

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: user-service-ingress
  namespace: webxemphim-user-service
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: api.webxemphim.com
    http:
      paths:
      - path: /api/v1/users
        pathType: Prefix
        backend:
          service:
            name: user-service
            port:
              number: 80
```

## 11.4 CI/CD Pipeline

### 11.4.1 GitHub Actions Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Run tests
      run: |
        docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
        
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Build Docker image
      run: |
        docker build -t webxemphim/user-service:${{ github.sha }} .
        docker tag webxemphim/user-service:${{ github.sha }} webxemphim/user-service:latest
        
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - name: Deploy to Kubernetes
      run: |
        kubectl apply -f k8s/
        kubectl set image deployment/user-service user-service=webxemphim/user-service:${{ github.sha }}
```

## 11.5 Monitoring & Logging

### 11.5.1 Health Checks

```typescript
// src/health/health.controller.ts
@Get('/health')
@ApiOperation({ summary: 'Health check endpoint' })
healthCheck(): { status: string; timestamp: string } {
  return {
    status: 'OK',
    timestamp: new Date().toISOString(),
  };
}
```

### 11.5.2 Metrics Collection

- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization
- **Loki**: Log aggregation
- **Jaeger**: Distributed tracing

---