# 🚀 Setup Guide - Movie Streaming Platform

> Hướng dẫn chi tiết để setup môi trường development cho dự án Movie Streaming Platform.

## 📋 Yêu cầu hệ thống

### Bắt buộc
- **Node.js**: >= 18.0.0 ([Download](https://nodejs.org/))
- **npm**: >= 8.0.0 (đi kèm với Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))

### Khuyến nghị
- **VS Code**: Latest version ([Download](https://code.visualstudio.com/))
- **Docker**: Latest version (cho local development)
- **PostgreSQL**: >= 14 (hoặc dùng Docker)
- **MongoDB**: >= 6.0 (hoặc dùng Docker)

## 🛠️ Cài đặt

### 1. Clone Repository

```bash
git clone <repository-url>
cd movie-streaming-platform
```

### 2. Cài đặt Dependencies

```bash
# Cài đặt tất cả dependencies
npm install

# Hoặc sử dụng yarn
yarn install
```

### 3. Cài đặt Git Hooks

```bash
# Cài đặt Husky hooks
npm run prepare
```

### 4. Cấu hình VS Code (Khuyến nghị)

Khi mở project trong VS Code, bạn sẽ được đề xuất cài đặt các extensions cần thiết:

**Extensions bắt buộc:**
- ESLint
- Prettier - Code formatter
- EditorConfig for VS Code
- TypeScript Importer

**Extensions khuyến nghị:**
- Jest
- GitLens
- Error Lens
- Path Intellisense

### 5. Kiểm tra Setup

```bash
# Kiểm tra Node.js version
node --version  # Phải >= 18.0.0

# Kiểm tra npm version
npm --version   # Phải >= 8.0.0

# Kiểm tra TypeScript
npx tsc --version

# Chạy quality checks
npm run quality
```

## 🔧 Cấu hình Environment

### 1. Tạo file .env

```bash
cp .env.example .env
```

### 2. Cập nhật các biến môi trường

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/movie_streaming_dev
MONGODB_URL=mongodb://localhost:27017/movie_streaming_dev

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# AWS S3 (hoặc MinIO cho local)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET=movie-streaming-bucket

# Redis (cho caching)
REDIS_URL=redis://localhost:6379

# RabbitMQ (cho messaging)
RABBITMQ_URL=amqp://localhost:5672
```

## 🐳 Setup với Docker (Khuyến nghị cho Development)

### 1. Tạo docker-compose.yml

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: movie_streaming_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: password

  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data

volumes:
  postgres_data:
  mongodb_data:
  minio_data:
```

### 2. Chạy services

```bash
# Chạy tất cả services
docker-compose up -d

# Kiểm tra status
docker-compose ps

# Xem logs
docker-compose logs -f
```

## 🧪 Chạy Tests

```bash
# Chạy tất cả tests
npm test

# Chạy tests với watch mode
npm run test:watch

# Chạy tests với coverage
npm run test:coverage

# Chạy tests cho file cụ thể
npm test -- user.service.test.ts
```

## 🔍 Code Quality Checks

```bash
# Chạy tất cả quality checks
npm run quality

# Chỉ chạy ESLint
npm run lint

# Fix ESLint errors tự động
npm run lint:fix

# Chỉ chạy Prettier check
npm run format:check

# Format code với Prettier
npm run format

# TypeScript type checking
npm run type-check
```

## 🚀 Development Workflow

### 1. Chạy Development Server

```bash
# Chạy với hot reload
npm run dev

# Hoặc build và chạy production mode
npm run build
npm start
```

### 2. Git Workflow

```bash
# Tạo feature branch
git checkout -b feature/new-feature

# Commit changes (sẽ tự động chạy pre-commit hooks)
git add .
git commit -m "feat: add new feature"

# Push (sẽ tự động chạy pre-push hooks)
git push origin feature/new-feature
```

### 3. Pre-commit Hooks

Khi commit, các hooks sau sẽ tự động chạy:
- **lint-staged**: Chỉ check files đã thay đổi
- **ESLint**: Fix lỗi tự động
- **Prettier**: Format code
- **Type check**: Kiểm tra TypeScript

### 4. Pre-push Hooks

Khi push, sẽ chạy:
- Tất cả quality checks
- Đảm bảo không có lỗi

## 🐛 Troubleshooting

### Lỗi thường gặp

#### 1. Node version không đúng
```bash
# Sử dụng nvm để quản lý Node versions
nvm install 18
nvm use 18
```

#### 2. Dependencies conflict
```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. ESLint/Prettier conflicts
```bash
# Chạy fix tự động
npm run quality:fix
```

#### 4. TypeScript errors
```bash
# Rebuild TypeScript
npm run build

# Hoặc chỉ type check
npm run type-check
```

#### 5. Git hooks không chạy
```bash
# Reinstall Husky
npm run prepare
```

### Database connection issues

#### PostgreSQL
```bash
# Kiểm tra PostgreSQL đang chạy
pg_isready -h localhost -p 5432

# Hoặc với Docker
docker-compose ps postgres
```

#### MongoDB
```bash
# Kiểm tra MongoDB
mongosh --eval "db.adminCommand('ismaster')"

# Hoặc với Docker
docker-compose ps mongodb
```

## 📚 Tài liệu thêm

- [ESLint Configuration](https://eslint.org/docs/user-guide/configuring/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [TypeScript Configuration](https://www.typescriptlang.org/tsconfig)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Husky Git Hooks](https://typicode.github.io/husky/)

## 🆘 Hỗ trợ

Nếu gặp vấn đề trong quá trình setup:

1. Kiểm tra [Issues](https://github.com/your-repo/issues) đã có
2. Tạo issue mới với label `setup`
3. Liên hệ team qua Slack/Discord

---

**Happy Coding! 🎉** 