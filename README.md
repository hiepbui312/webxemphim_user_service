# 🎬 WebXemPhim K8s

> Nền tảng streaming phim với kiến trúc microservices, được triển khai trên Kubernetes.

## 📋 Mục lục

- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Git Workflow & Conventional Commits](#git-workflow--conventional-commits)
- [Kiểm soát chất lượng code](#kiểm-soát-chất-lượng-code)
- [Scripts có sẵn](#scripts-có-sẵn)
- [Contributing](#contributing)

## 🔧 Yêu cầu hệ thống

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **Git**: Latest version
- **TypeScript**: >= 5.0.0

## 🚀 Cài đặt

```bash
# Clone repository
git clone https://github.com/webxemphim/webxemphim-k8s.git
cd webxemphim-k8s

# Cài đặt dependencies
npm install

# Setup git hooks (Husky)
npm run prepare

# Cấu hình git commit template (optional)
git config commit.template .gitmessage
```

## 📝 Git Workflow & Conventional Commits

### Conventional Commits

Dự án sử dụng **Conventional Commits** để standardize commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type | Mô tả | Ví dụ |
|------|-------|-------|
| `feat` | Tính năng mới | `feat(auth): add JWT authentication` |
| `fix` | Sửa bug | `fix(streaming): resolve video buffering` |
| `docs` | Documentation | `docs(readme): update setup guide` |
| `style` | Code formatting | `style(eslint): fix linting errors` |
| `refactor` | Code refactoring | `refactor(api): simplify user service` |
| `perf` | Performance | `perf(db): optimize query performance` |
| `test` | Tests | `test(user): add unit tests` |
| `chore` | Maintenance | `chore(deps): update dependencies` |
| `ci` | CI/CD | `ci(k8s): add deployment pipeline` |
| `build` | Build system | `build(webpack): optimize bundle` |

### Scopes

**Core Services:** `auth`, `user`, `movie`, `streaming`, `payment`, `notification`  
**Infrastructure:** `k8s`, `docker`, `ci`, `monitoring`, `logging`  
**Frontend:** `ui`, `components`, `pages`, `styles`  
**Backend:** `api`, `database`, `cache`, `queue`, `storage`  
**Tools:** `eslint`, `prettier`, `jest`, `webpack`, `deps`, `config`  

### Sử dụng Commitizen

Để tạo commit messages chuẩn một cách dễ dàng:

```bash
# Thay vì git commit, sử dụng:
npm run commit

# Tool sẽ hướng dẫn bạn qua từng bước
```

### Git Hooks

#### Pre-commit Hook
Tự động chạy khi commit:
- ✅ **lint-staged**: Check và fix code đã thay đổi
- ✅ **ESLint**: Fix linting errors
- ✅ **Prettier**: Format code

#### Commit-msg Hook
Validate commit message:
- ✅ **commitlint**: Đảm bảo commit message theo Conventional Commits

#### Pre-push Hook
Chạy trước khi push:
- ✅ **Quality checks**: ESLint + Prettier + TypeScript
- ✅ **Tests**: Unit tests và integration tests

## 🔍 Kiểm soát chất lượng code

### ESLint
- **Phát hiện lỗi** code và enforce coding standards
- **TypeScript integration** với type checking
- **Security rules** để phát hiện vulnerabilities
- **Import organization** và dependency management

### Prettier
- **Auto-format code** để đảm bảo style nhất quán
- **Integration** với ESLint và EditorConfig
- **Multi-file support** (TS, JS, JSON, MD, YAML)

### TypeScript
- **Strict mode** để catch errors sớm
- **Path mapping** với `@/` prefix cho absolute imports
- **Type checking** trong development và build

## 📜 Scripts có sẵn

### Development
```bash
npm run dev          # Development server với hot reload
npm start            # Production server
npm run build        # Build TypeScript
```

### Code Quality
```bash
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier format
npm run format:check # Prettier check only
npm run type-check   # TypeScript type check
npm run quality      # Tất cả checks
npm run quality:fix  # Tất cả fixes
```

### Testing
```bash
npm test             # Chạy tests
npm run test:watch   # Tests với watch mode
npm run test:coverage # Tests với coverage report
```

### Git & Release
```bash
npm run commit       # Commitizen (guided commit)
npm run release      # Tạo release với standard-version
npm run prepare      # Setup Husky hooks
```

## 🔄 Development Workflow

### 1. Tạo feature branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Development
```bash
# Chạy dev server
npm run dev

# Chạy tests trong watch mode
npm run test:watch

# Check quality
npm run quality
```

### 3. Commit changes
```bash
# Stage changes
git add .

# Commit với Commitizen (khuyến nghị)
npm run commit

# Hoặc commit thông thường (sẽ được validate)
git commit -m "feat(auth): add JWT authentication"
```

### 4. Push và tạo PR
```bash
# Push (sẽ chạy pre-push hooks)
git push origin feature/your-feature-name

# Tạo Pull Request trên GitHub
```

## 🚀 Release Process

### Automatic Release với Standard-Version

```bash
# Tạo release mới (auto-bump version, generate changelog)
npm run release

# Pre-release
npm run release -- --prerelease alpha

# Specific version
npm run release -- --release-as 1.2.0

# Dry run (xem trước)
npm run release -- --dry-run
```

### Changelog tự động

Changelog được generate từ commit messages:

```markdown
# Changelog

## [1.2.0] - 2024-01-15

### ✨ Features
* **auth**: add OAuth2 integration
* **streaming**: implement video quality selection

### 🐛 Bug Fixes
* **payment**: resolve gateway timeout issue

### 📚 Documentation
* **readme**: update installation guide
```

## 🛠️ Tech Stack

**Core:**
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL + MongoDB
- **Message Queue**: RabbitMQ
- **Storage**: S3/MinIO
- **Orchestration**: Kubernetes

**Code Quality:**
- **Linting**: ESLint + TypeScript ESLint + Security rules
- **Formatting**: Prettier + EditorConfig
- **Testing**: Jest với coverage requirements
- **Git Hooks**: Husky + lint-staged + commitlint
- **Release**: standard-version + Conventional Commits

## 🤝 Contributing

Xem chi tiết trong [CONTRIBUTING.md](./CONTRIBUTING.md)

### Quick Start

1. **Fork & Clone**
2. **Install dependencies**: `npm install`
3. **Setup hooks**: `npm run prepare`
4. **Create feature branch**: `git checkout -b feature/your-feature`
5. **Develop & Test**: `npm run dev` + `npm run test:watch`
6. **Commit**: `npm run commit`
7. **Push & PR**: `git push origin feature/your-feature`

### Code Review Checklist

- [ ] ✅ Code quality (ESLint + Prettier)
- [ ] 🧪 Tests pass với coverage >= 80%
- [ ] 📝 Commit messages theo Conventional Commits
- [ ] 📚 Documentation updated
- [ ] 🔒 Security considerations
- [ ] ⚡ Performance impact

## 🐛 Troubleshooting

### Git Hooks Issues

```bash
# Reinstall hooks
npm run prepare

# Check hook permissions (Linux/Mac)
ls -la .husky/

# Manual hook test
npx lint-staged
npx commitlint --from HEAD~1 --to HEAD --verbose
```

### Commit Message Validation

```bash
# Use guided commit
npm run commit

# Check commit message format
npx commitlint --from HEAD~1 --to HEAD --verbose

# Example valid commits:
git commit -m "feat(auth): add JWT authentication"
git commit -m "fix(streaming): resolve buffering issue"
git commit -m "docs(readme): update installation guide"
```

### Quality Checks Fail

```bash
# Fix all issues automatically
npm run quality:fix

# Check individual tools
npm run lint:fix
npm run format
npm run type-check
```

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/webxemphim/webxemphim-k8s/issues)
- **Contributing**: [Contributing Guide](./CONTRIBUTING.md)
- **Discussions**: [GitHub Discussions](https://github.com/webxemphim/webxemphim-k8s/discussions)

---

**Happy Coding! 🚀** 