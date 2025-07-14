# 4. Assumptions & Constraints

* **Assumptions:**
    * PostgreSQL database luôn available và performance tốt.
    * RabbitMQ message broker hoạt động stable cho việc inter-service communication.
    * Auth Service cung cấp JWT tokens hợp lệ cho authentication.
    * API Gateway handle load balancing và rate limiting properly.
    * Frontend applications tuân thủ API contract đã định nghĩa.

* **Constraints:**
    * User Service phải tuân thủ data privacy regulations (GDPR, CCPA).
    * Hệ thống phải handle concurrent users và high throughput.
    * API response time phải dưới 200ms cho các operations thường xuyên.
    * Database connections phải được pool và optimize để tránh connection leaks.
    * Service phải implement proper error handling và logging.
    * Phải maintain backward compatibility khi update API versions.

---
