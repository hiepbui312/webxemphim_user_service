# 1. Architecture Overview

## 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Service                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Controllers   │  │   Guards/MW     │  │   Interceptors  │  │
│  │   (REST API)    │  │   (Auth/Valid)  │  │   (Logging)     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Services      │  │   DTOs/Pipes    │  │   Filters       │  │
│  │  (Business)     │  │   (Validation)  │  │   (Error)       │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Repositories  │  │   Entities      │  │   Event Bus     │  │
│  │   (Data Access) │  │   (ORM Models)  │  │   (RabbitMQ)    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │ PostgreSQL  │    │   Redis     │    │  RabbitMQ   │
    │  Database   │    │   Cache     │    │   Message   │
    └─────────────┘    └─────────────┘    └─────────────┘
```

## 1.2 Technology Stack
- **Framework**: NestJS (Node.js + TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **API**: RESTful with OpenAPI/Swagger
- **Validation**: class-validator + class-transformer
- **Testing**: Jest + Supertest
- **Monitoring**: Prometheus + Grafana

---
