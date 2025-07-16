# Makefile for WebXemPhim User Service

.PHONY: help build start stop restart clean logs ps dev test

# Default target
help:
	@echo "Available commands:"
	@echo "  build     - Build Docker images"
	@echo "  start     - Start all services (production mode)"
	@echo "  dev       - Start services in development mode"
	@echo "  test      - Run tests in Docker"
	@echo "  stop      - Stop all services"
	@echo "  restart   - Restart all services"
	@echo "  clean     - Remove containers and volumes"
	@echo "  logs      - Show logs"
	@echo "  ps        - Show running containers"
	@echo "  migrate   - Run database migrations"
	@echo "  seed      - Seed database with test data"

# Build Docker images
build:
	@echo "Building Docker images..."
	docker compose build
	docker compose -f docker-compose.dev.yml build

# Start services (production mode)
start:
	@echo "Starting services in production mode..."
	docker compose up -d

# Start services in development mode
dev:
	@echo "Starting services in development mode..."
	docker compose -f docker-compose.dev.yml up -d

# Run tests
test:
	@echo "Running tests..."
	docker compose -f docker-compose.test.yml up --build --abort-on-container-exit

# Stop all services
stop:
	@echo "Stopping all services..."
	docker compose down
	docker compose -f docker-compose.dev.yml down
	docker compose -f docker-compose.test.yml down

# Restart services
restart: stop start

# Clean containers and volumes
clean:
	@echo "Cleaning containers and volumes..."
	docker compose down -v --remove-orphans
	docker compose -f docker-compose.dev.yml down -v --remove-orphans
	docker compose -f docker-compose.test.yml down -v --remove-orphans
	docker system prune -f

# Show logs
logs:
	docker compose logs -f

# Show running containers
ps:
	docker compose ps

# Run database migrations
migrate:
	@echo "Running database migrations..."
	docker compose exec app npm run migration:run

# Seed database
seed:
	@echo "Seeding database..."
	docker compose exec app npm run seed

# Development helpers
dev-logs:
	docker compose -f docker-compose.dev.yml logs -f

dev-shell:
	docker compose -f docker-compose.dev.yml exec app sh

dev-db:
	docker compose -f docker-compose.dev.yml exec postgres psql -U postgres -d webxemphim_dev

# Test helpers
test-logs:
	docker compose -f docker-compose.test.yml logs -f

test-shell:
	docker compose -f docker-compose.test.yml exec app-test sh

# Health check
health:
	@echo "Checking service health..."
	curl -f http://localhost:3000/health || echo "Service is not healthy"

# Install dependencies
install:
	@echo "Installing dependencies..."
	docker compose -f docker-compose.dev.yml exec app npm install

# Run linting
lint:
	@echo "Running linter..."
	docker compose -f docker-compose.dev.yml exec app npm run lint

# Run formatting
format:
	@echo "Running formatter..."
	docker compose -f docker-compose.dev.yml exec app npm run format 