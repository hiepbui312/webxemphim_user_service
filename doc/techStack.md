# 📚 Tech Stack Overview – Movie Streaming Platform

> Tài liệu này tổng hợp mọi thành phần công nghệ được sử dụng trong hệ thống Streaming Platform, phản ánh 3 sơ đồ C4 (Context, Container, Component).

---

## 1. Runtime & Frameworks
| Layer | Technology | Lý do chọn |
|-------|------------|------------|
| API Gateway & Micro-services | **Node.js** + **Nest js** (TypeScript) | Môi trường đồng nhất JS/TS, cộng đồng lớn, nhiều thư viện, dễ scale theo mô hình serverless/micro-service. |
| Worker Jobs | **Node.js** (BullMQ / Custom workers) | Xử lý bất đồng bộ (transcoding, gửi mail, …) vẫn dùng cùng runtime với service. |

## 2. Media Processing & Storage
| Nhu cầu | Technology | Ghi chú |
|---------|------------|---------|
| Transcoding | **FFmpeg** | Chuyển mã sang HLS, DASH; resize, watermark. |
| Streaming packaging | **HLS** | Chuẩn HTTP Live Streaming – hỗ trợ đa bitrate. |
| Object Storage (cloud) | **Amazon S3** | Lưu trữ file `.m3u8`, `.ts`, poster, subtitle… |
| Object Storage (local dev) | **MinIO** | S3-compatible, chạy local / k8s cluster dev. |
| CDN | CloudFront | Phân phối video, cache edge. |

## 3. Databases
| Loại dữ liệu | Technology | Chức năng |
|--------------|------------|-----------|
| Quan hệ (transactional) | **PostgreSQL** | Lưu giao dịch thanh toán, quyền truy cập, hồ sơ người dùng, quản trị. |
| NoSQL (document) | **MongoDB** | Metadata phim (tag, cast, rating…), bình luận, lịch sử xem nhanh. |

## 4. Messaging & Eventing
| Mục đích | Technology | Sự kiện chính |
|-----------|------------|--------------|
| Event Bus | **RabbitMQ** | `user.created`, `auth.login`, `payment.completed`, `video.uploaded`… |

## 5. Observability (Logs, Metrics, Tracing)
| Loại | Technology | Mô tả |
|------|------------|-------|
| Log shipping | **Fluent Bit** | Thu thập & đẩy log container. |
| Central log store | **Grafana Loki** | Lưu trữ, query log kiểu Promtail nhưng tối ưu chi phí. |
| Dashboard & Alert | **Grafana** | Visualize metrics, log, set alert rule. |
| Tracing (optional) | **OpenTelemetry** | Thu thập trace, export sang Grafana Tempo / Jaeger. |

## 6. Infrastructure & Platform
| Thành phần | Technology | Ghi chú |
|------------|-----------|---------|
| Container orchestration | **Kubernetes** | Triển khai tất cả service (trừ DB) với Auto-Scaling, Rolling update. |
| CI/CD | GitHub Actions / GitLab CI | Build, test, push image, apply helm chart. |
| Secrets | **Vault** / K8s Secrets (SOPS) | Quản lý secret an toàn. |
| Service Discovery / Ingress | **Ingress-NGINX** | HTTPS, rate-limit, path routing. |
| Helm Charts | **Helm** | Quản lý manifest k8s. |

## 7. Dev & Test Tooling
| Mục đích | Technology |
|----------|------------|
| Local k8s | **kind** / **k3d** |
| API Test | **Postman**
| Static Analysis | **ESLint**, **Prettier**, **TypeScript** strict |
| Unit Test | **Jest** |

---

## 8. Security & Compliance
* JWT / OAuth 2.0 trong **Auth Service**
* HTTPS (Let's Encrypt / ACM) qua Ingress
* Role-Based Access Control (RBAC) trong Postgres & k8s
* Audit log lưu vào Loki

---

## 9. Deployment Diagram (Tóm tắt)
```
[Users] -> (Ingress) -> {APIGateway} -> Services (Auth, User, Movie, Billing, Stream, Notify, Transcoder)
             ↓                                  ↓
        Loki/Grafana <- FluentBit         RabbitMQ <--► Services
             ↓                                  ↓
           Grafana Dashboard            S3/MinIO, Postgres, MongoDB
```

> File này sẽ được cập nhật song song với thay đổi trong các sơ đồ C4 để luôn đồng bộ. 