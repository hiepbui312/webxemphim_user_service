# 🤝 Contributing Guide

> Hướng dẫn đóng góp cho dự án WebXemPhim K8s

## 📋 Mục lục

- [Quy trình đóng góp](#quy-trình-đóng-góp)
- [Conventional Commits](#conventional-commits)
- [Git Workflow](#git-workflow)
- [Code Quality](#code-quality)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

## 🚀 Quy trình đóng góp

### 1. Setup môi trường

```bash
# Fork repository và clone về local
git clone https://github.com/your-username/webxemphim-k8s.git
cd webxemphim-k8s

# Cài đặt dependencies
npm install

# Setup git hooks
npm run prepare

# Cấu hình git commit template (optional)
git config commit.template .gitmessage
```

### 2. Tạo branch mới

```bash
# Tạo branch từ main/develop
git checkout -b feature/your-feature-name

# Hoặc cho bug fix
git checkout -b fix/bug-description

# Hoặc cho hotfix
git checkout -b hotfix/critical-issue
```

### 3. Development

```bash
# Chạy development server
npm run dev

# Chạy tests trong watch mode
npm run test:watch

# Chạy quality checks
npm run quality
```

## 📝 Conventional Commits

Dự án sử dụng **Conventional Commits** để standardize commit messages và tự động generate changelog.

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Mô tả | Ví dụ |
|------|-------|-------|
| `feat` | Tính năng mới | `feat(auth): add JWT authentication` |
| `fix` | Sửa bug | `fix(streaming): resolve video buffering issue` |
| `docs` | Thay đổi documentation | `docs(readme): update installation guide` |
| `style` | Format code, không thay đổi logic | `style(eslint): fix linting errors` |
| `refactor` | Refactor code | `refactor(api): simplify user service` |
| `perf` | Cải thiện performance | `perf(database): optimize query performance` |
| `test` | Thêm/sửa tests | `test(user): add unit tests for user service` |
| `ci` | CI/CD changes | `ci(k8s): add staging deployment` |
| `build` | Build system changes | `build(webpack): optimize bundle size` |
| `revert` | Revert commit | `revert: feat(auth): add JWT authentication` |
| `hotfix` | Hotfix cho production | `hotfix(payment): fix payment gateway error` |

### Scopes

Scopes giúp xác định phần nào của codebase bị ảnh hưởng:

**Core Services:**
- `auth`, `user`, `movie`, `streaming`, `payment`, `notification`

**Infrastructure:**
- `k8s`, `docker`, `ci`, `monitoring`, `logging`

**Frontend:**
- `ui`, `components`, `pages`, `styles`

**Backend:**
- `api`, `database`, `cache`, `queue`, `storage`

**Tools & Config:**
- `eslint`, `prettier`, `jest`, `webpack`, `deps`, `config`

**Documentation:**
- `readme`, `docs`, `changelog`

### Ví dụ Commits

```bash
# Tính năng mới
feat/add OAuth2 integration with Google

# Bug fix
fix/resolve CORS issue for video API

# Documentation
docs/add OpenAPI specification
```

### Sử dụng Commitizen

Để dễ dàng tạo commit messages đúng format:

```bash
# Thay vì git commit, sử dụng:
npm run commit

# Hoặc
npx git-cz
```

Tool sẽ hướng dẫn bạn qua từng bước để tạo commit message chuẩn.

## 🔄 Git Workflow

### Branch Strategy

```
main
├── develop
│   ├── feature/user-authentication
│   ├── feature/video-streaming
│   └── fix/payment-gateway
├── release/v1.2.0
└── hotfix/critical-security-fix
```

### Workflow Steps

1. **Feature Development**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature
   # ... development work ...
   git add .
   npm run commit  # Sử dụng Commitizen
   git push origin feature/your-feature
   ```

2. **Create Pull Request**
   - Tạo PR từ feature branch vào `develop`
   - Điền đầy đủ PR template
   - Assign reviewers

3. **Code Review**
   - Reviewer check code quality
   - CI/CD pipeline chạy tự động
   - Fix feedback nếu có

4. **Merge**
   - Squash and merge (khuyến nghị)
   - Delete feature branch sau khi merge

## ✅ Code Quality

### Pre-commit Hooks

Khi commit, các hooks sau sẽ tự động chạy:

1. **lint-staged**: Check và fix code đã thay đổi
2. **ESLint**: Fix linting errors
3. **Prettier**: Format code
4. **commitlint**: Validate commit message

### Pre-push Hooks

Khi push, sẽ chạy:

1. **Quality checks**: ESLint + Prettier + TypeScript
2. **Tests**: Unit tests và integration tests

### Manual Quality Checks

```bash
# Chạy tất cả quality checks
npm run quality

# Chỉ ESLint
npm run lint
npm run lint:fix

# Chỉ Prettier
npm run format:check
npm run format

# TypeScript type checking
npm run type-check
```

## 🧪 Testing

### Test Requirements

- **Unit tests** cho tất cả business logic
- **Integration tests** cho API endpoints
- **Coverage threshold**: 80% minimum

### Running Tests

```bash
# Chạy tất cả tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Test specific file
npm test -- user.service.test.ts
```

### Test Structure

```
tests/
├── unit/
│   ├── services/
│   ├── controllers/
│   └── utils/
├── integration/
│   ├── api/
│   └── database/
└── setup.ts
```

## 🔀 Pull Request Process

### PR Template

Khi tạo PR, sử dụng template có sẵn:

```markdown
## 📝 Mô tả Thay đổi
Brief description of changes

## 🔗 Issue Liên quan
- Closes #123
- Related to #456

## ✅ Checklist
- [ ] Code tuân theo style guide
- [ ] Đã thêm tests
- [ ] Tests pass
- [ ] Documentation updated
```

### Review Criteria

**Code Quality:**
- [ ] Code readable và maintainable
- [ ] Tuân theo coding conventions
- [ ] No code smells

**Functionality:**
- [ ] Feature hoạt động đúng requirements
- [ ] Edge cases được handle
- [ ] Error handling appropriate

**Testing:**
- [ ] Adequate test coverage
- [ ] Tests pass consistently
- [ ] No flaky tests

**Documentation:**
- [ ] Code comments where needed
- [ ] README updated if needed
- [ ] API docs updated

### Merge Strategy

1. **Squash and Merge** (khuyến nghị)
   - Gộp tất cả commits thành 1
   - Commit message theo Conventional Commits
   - Clean git history

2. **Merge Commit**
   - Giữ nguyên commit history
   - Chỉ dùng cho feature lớn

## 🚀 Release Process

### Automatic Releases

Sử dụng `standard-version` để tự động:

```bash
# Tạo release mới
npm run release

# Pre-release
npm run release -- --prerelease alpha

# Specific version
npm run release -- --release-as 1.2.0

# Dry run (xem trước)
npm run release -- --dry-run
```

### Release Steps

1. **Prepare Release**
   ```bash
   git checkout main
   git pull origin main
   npm run quality  # Ensure quality
   ```

2. **Create Release**
   ```bash
   npm run release
   ```

3. **Push Release**
   ```bash
   git push --follow-tags origin main
   ```

### Changelog

Changelog được tự động generate từ commit messages:

```markdown
# Changelog

## [1.2.0](https://github.com/webxemphim/webxemphim-k8s/compare/v1.1.0...v1.2.0) (2024-01-15)

### ✨ Features
* **auth**: add OAuth2 integration ([abc123](https://github.com/webxemphim/webxemphim-k8s/commit/abc123))

### 🐛 Bug Fixes
* **streaming**: resolve buffering issue ([def456](https://github.com/webxemphim/webxemphim-k8s/commit/def456))
```

## 🆘 Troubleshooting

### Common Issues

**Commit message validation fails:**
```bash
# Check commit message format
npx commitlint --from HEAD~1 --to HEAD --verbose

# Use commitizen for guided commit
npm run commit
```

**Pre-commit hooks fail:**
```bash
# Fix linting errors
npm run lint:fix

# Format code
npm run format

# Check what's failing
npm run quality
```

**Tests fail:**
```bash
# Run tests with verbose output
npm test -- --verbose

# Check specific test
npm test -- --testNamePattern="user service"
```

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/webxemphim/webxemphim-k8s/issues)
- **Discussions**: [GitHub Discussions](https://github.com/webxemphim/webxemphim-k8s/discussions)
- **Team Chat**: Slack/Discord

---

**Happy Contributing! 🎉** 