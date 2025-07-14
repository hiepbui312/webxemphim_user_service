# Docker Setup Guide

## Tổng quan

Dự án WebXemPhim User Service hỗ trợ Docker và Docker Compose để phát triển và testing ở local. Điều này giúp đảm bảo môi trường phát triển nhất quán cho tất cả các developer.

## Yêu cầu

- Docker Engine 20.10+
- Docker Compose 2.0+
- Make (optional, để sử dụng Makefile)

## Cấu trúc Files

```
├── Dockerfile                 # Production build
├── Dockerfile.dev            # Development build  
├── docker-compose.yml        # Production environment
├── docker-compose.dev.yml    # Development environment
├── docker-compose.test.yml   # Testing environment
├── .dockerignore             # Docker ignore rules
├── Makefile                  # Convenient commands
└── scripts/
    ├── init-db.sql          # Development database init
    └── init-test-db.sql     # Test database init
```

## Quick Start

### 1. Development Mode

```bash
# Sử dụng Make (khuyến nghị)
make dev

# Hoặc sử dụng Docker Compose trực tiếp
docker-compose -f docker-compose.dev.yml up --build

# Hoặc sử dụng npm script
npm run docker:dev
```

### 2. Production Mode

```bash
# Sử dụng Make
make start

# Hoặc sử dụng Docker Compose
docker-compose up --build -d

# Hoặc sử dụng npm script
npm run docker:prod
```

### 3. Testing Mode

```bash
# Sử dụng Make
make test

# Hoặc sử dụng Docker Compose
docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit

# Hoặc sử dụng npm script
npm run docker:test
```

## Services

| Service | Development Port | Test Port | Production Port |
|---------|------------------|-----------|-----------------|
| NestJS App | 3000 | - | 3000 |
| PostgreSQL | 5432 | 5433 | 5432 |
| Redis | 6379 | 6380 | 6379 |
| RabbitMQ | 5672 | 5673 | 5672 |
| RabbitMQ UI | 15672 | 15673 | 15672 |

## Useful Commands

### Make Commands (Khuyến nghị)

```bash
make help         # Hiển thị tất cả commands
make build        # Build Docker images
make dev          # Start development environment
make start        # Start production environment
make test         # Run tests
make stop         # Stop all services
make clean        # Clean containers and volumes
make logs         # View logs
make dev-shell    # Access development container shell
make dev-db       # Access development database
```

### Docker Compose Commands

```bash
# Start services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down

# Clean everything
docker-compose -f docker-compose.dev.yml down -v --remove-orphans
```

### NPM Scripts

```bash
npm run docker:build    # Build production image
npm run docker:dev      # Start development environment
npm run docker:test     # Run tests
npm run docker:prod     # Start production environment
npm run docker:stop     # Stop all services
npm run docker:clean    # Clean all containers and volumes
```

## Environment Variables

### Development
- Các biến môi trường được định nghĩa trong docker-compose.dev.yml
- Database: `webxemphim_dev`
- Credentials: `postgres/postgres`

### Testing
- Isolated environment với separate ports
- Database: `webxemphim_test`
- Credentials: `postgres/postgres`

### Production
- Sử dụng production credentials
- Environment variables từ secret management

## Development Workflow

### 1. Bắt đầu development

```bash
# Clone project
git clone <repository-url>
cd webxemphim_user_service

# Start development environment
make dev

# Check services
make ps
```

### 2. Development với live reload

Development mode sử dụng volume mount để live reload:

```bash
# Code changes sẽ tự động reload
# Không cần restart container

# View logs
make dev-logs

# Access container shell
make dev-shell
```

### 3. Testing

```bash
# Run unit tests
make test

# Run specific test
docker-compose -f docker-compose.test.yml exec app-test npm run test:watch

# Run e2e tests
docker-compose -f docker-compose.test.yml exec app-test npm run test:e2e
```

### 4. Debugging

```bash
# Development mode exposes debug port 9229
# Connect debugger to localhost:9229

# Access application logs
make dev-logs

# Access database
make dev-db
```

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Kill the process
   kill -9 <PID>
   ```

2. **Database connection issues**
   ```bash
   # Check database logs
   docker-compose -f docker-compose.dev.yml logs postgres
   
   # Reset database
   make clean
   make dev
   ```

3. **Permission issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Clean Start

```bash
# Complete clean restart
make clean
docker system prune -f
make dev
```

## Production Considerations

- Production images sử dụng multi-stage build để tối ưu size
- Non-root user để tăng security
- Health checks được configure
- Resource limits được set appropriately
- Secrets management thông qua environment variables

## Monitoring

- Health check endpoint: `http://localhost:3000/health`
- RabbitMQ management UI: `http://localhost:15672` (admin/admin)
- Application logs: `make logs`

---

Để biết thêm chi tiết, tham khảo:
- [Architecture Documentation](../architecture/)
- [Deployment Architecture](../architecture/11-deployment-architecture.md)
- [Tech Stack](../overall/techStack.md) 