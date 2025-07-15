# 1. Architecture Overview

## 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Service                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Controllers   │  │  JWT Guards     │  │   Validation    │  │
│  │  (User/Auth)    │  │  (Security)     │  │   (Pipes/DTOs)  │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Services      │  │   Interfaces    │  │  Config Service │  │
│  │  (Business)     │  │   (TypeScript)  │  │  (Centralized)  │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Repositories  │  │   Entities      │  │   Migrations    │  │
│  │  (TypeORM)      │  │  (User Model)   │  │  (Database)     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │ PostgreSQL  │    │   Joi       │    │    JWT      │
    │  Database   │    │ Validation  │    │   Security  │
    └─────────────┘    └─────────────┘    └─────────────┘
```

## 1.2 Current Implementation Status

**Implemented Components:**
- ✅ **User Management**: Profile CRUD operations with validation
- ✅ **JWT Authentication**: Complete auth flow with guards
- ✅ **Configuration Management**: Centralized config with validation
- ✅ **Database Layer**: PostgreSQL with TypeORM migrations
- ✅ **API Documentation**: OpenAPI/Swagger integration
- ✅ **Type Safety**: Full TypeScript with interfaces

**Architecture Patterns Applied:**
- ✅ **Domain-Driven Design**: Modules organized by business domain
- ✅ **Dependency Injection**: NestJS IoC container
- ✅ **Repository Pattern**: Data access abstraction
- ✅ **Configuration Pattern**: Centralized env management
- ✅ **Interface Segregation**: Clean type definitions

## 1.3 Technology Stack

**Core Framework:**
- **NestJS**: Node.js framework with TypeScript
- **TypeScript**: Full type safety and modern JavaScript features

**Database & ORM:**
- **PostgreSQL**: Primary database for persistent data
- **TypeORM**: Object-relational mapping with migrations
- **Joi**: Configuration validation schema

**Authentication & Security:**
- **JWT**: JSON Web Tokens for stateless authentication
- **Passport**: Authentication middleware with JWT strategy
- **bcrypt**: Password hashing (planned for future auth expansion)

**API & Documentation:**
- **RESTful API**: Clean REST endpoints
- **OpenAPI/Swagger**: Auto-generated API documentation
- **class-validator**: DTO validation
- **class-transformer**: Object transformation

**Development & Build:**
- **Docker**: Containerization for all environments
- **npm/yarn**: Package management
- **ESLint**: Code linting and formatting
- **Jest**: Testing framework (configured for future tests)

**Configuration:**
- **Environment Variables**: Centralized configuration management
- **AppConfigService**: Type-safe configuration access
- **No Default Values**: Strict environment variable validation

---
