# 5. Risks

* **R-001 - Data Privacy Violation:** Thông tin cá nhân của người dùng có thể bị lộ hoặc truy cập trái phép.
    * **Likelihood:** M
    * **Impact:** H
    * **Mitigation / Action Plan:** Implement encryption for sensitive data, proper access controls, regular security audits, và compliance với data protection regulations.

* **R-002 - Database Performance Issues:** PostgreSQL có thể gặp performance bottleneck khi số lượng user tăng cao.
    * **Likelihood:** M
    * **Impact:** H
    * **Mitigation / Action Plan:** Implement database indexing, query optimization, connection pooling, và horizontal scaling strategies.

* **R-003 - Message Queue Failures:** RabbitMQ downtime có thể gây mất events và data inconsistency.
    * **Likelihood:** L
    * **Impact:** M
    * **Mitigation / Action Plan:** Implement retry mechanisms, dead letter queues, circuit breakers, và monitoring alerts.

* **R-004 - API Breaking Changes:** Changes trong API có thể break existing client applications.
    * **Likelihood:** M
    * **Impact:** M
    * **Mitigation / Action Plan:** Implement API versioning, proper documentation, backward compatibility, và thorough testing.

---
