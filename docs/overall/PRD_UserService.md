# Product Requirements Document (PRD) - User Service

**Project Name:** Movie Streaming Platform - User Service

**Date:** 2024-01-15

**Version:** 1.0 (Initial Draft)

**Prepared By:** Development Team

---

## 1. Introduction / Overview

* **Project Summary:** User Service là một microservice trong hệ thống Movie Streaming Platform, chịu trách nhiệm quản lý thông tin người dùng, profile, lịch sử xem phim và các tính năng liên quan đến tài khoản người dùng.

* **Detailed Overview:** User Service được xây dựng trên Node.js với NestJS framework, sử dụng PostgreSQL làm cơ sở dữ liệu chính để lưu trữ thông tin người dùng. Service này tích hợp với các service khác trong hệ thống thông qua RabbitMQ message broker và cung cấp REST API thông qua API Gateway. User Service không chỉ quản lý thông tin cá nhân mà còn theo dõi hành vi người dùng, lịch sử xem phim, và hỗ trợ các tính năng cá nhân hóa như danh sách yêu thích và gợi ý phim.

---

## 2. Business Requirements (BR)

* **BR-001 - Quản lý thông tin người dùng:** Cung cấp khả năng lưu trữ và quản lý thông tin cá nhân của người dùng bao gồm profile, preferences và settings.

* **BR-002 - Theo dõi hoạt động người dùng:** Ghi lại và phân tích hành vi xem phim của người dùng để cải thiện trải nghiệm và cung cấp gợi ý phim phù hợp.

* **BR-003 - Hỗ trợ tính năng cá nhân hóa:** Cho phép người dùng tạo danh sách yêu thích, lưu phim để xem sau và quản lý preferences cá nhân.

* **BR-004 - Tích hợp với hệ thống Authentication:** Làm việc liền mạch với Auth Service để xác thực và phân quyền người dùng.

* **BR-005 - Cung cấp API cho frontend:** Expose REST API để Web App và Admin Portal có thể truy cập và quản lý thông tin người dùng.

* **BR-006 - Hỗ trợ analytics và reporting:** Cung cấp dữ liệu thống kê về người dùng cho Admin dashboard và business intelligence.

* **BR-007 - Đảm bảo data privacy và security:** Bảo vệ thông tin cá nhân của người dùng theo các tiêu chuẩn bảo mật và quy định về dữ liệu.

---

## 3. Functional Requirements (FR)

* **FR-001 - Quản lý User Profile:** Hệ thống PHẢI cho phép người dùng xem và chỉnh sửa thông tin cá nhân.
    * **Description:** Người dùng có thể cập nhật thông tin như tên, email, avatar, ngày sinh, giới tính và các preferences.
    * **Trigger/Event:** User gửi request cập nhật profile thông qua API.
    * **Pre-conditions:** User đã được authenticate và có quyền truy cập.
    * **Post-conditions:** Thông tin profile được cập nhật trong database và thông báo thành công.
    * **Priority:** H

* **FR-002 - Lưu trữ lịch sử xem phim:** Hệ thống PHẢI ghi lại các bộ phim mà người dùng đã xem.
    * **Description:** Tự động lưu thông tin phim đã xem, thời gian xem, và progress để người dùng có thể tiếp tục xem.
    * **Trigger/Event:** Nhận event từ Playback Service khi user xem phim.
    * **Pre-conditions:** User đang xem phim và đã authenticate.
    * **Post-conditions:** Lịch sử xem được lưu vào database.
    * **Priority:** H

* **FR-003 - Quản lý danh sách yêu thích:** Hệ thống PHẢI cho phép người dùng tạo và quản lý danh sách phim yêu thích.
    * **Description:** User có thể thêm/xóa phim khỏi danh sách yêu thích và xem danh sách này.
    * **Trigger/Event:** User thao tác với favorite list thông qua UI.
    * **Pre-conditions:** User đã authenticate và phim tồn tại trong hệ thống.
    * **Post-conditions:** Danh sách yêu thích được cập nhật.
    * **Priority:** M

* **FR-004 - Cung cấp user statistics:** Hệ thống PHẢI tính toán và cung cấp thống kê về hoạt động của người dùng.
    * **Description:** Thống kê thời gian xem, thể loại phim yêu thích, số lượng phim đã xem.
    * **Trigger/Event:** Admin hoặc user request thống kê.
    * **Pre-conditions:** User có dữ liệu hoạt động trong hệ thống.
    * **Post-conditions:** Thống kê được tính toán và trả về.
    * **Priority:** M

* **FR-005 - Xử lý User Events:** Hệ thống PHẢI consume và process các events liên quan đến user từ message queue.
    * **Description:** Lắng nghe events như user.created, user.updated, payment.completed để cập nhật user data.
    * **Trigger/Event:** Events được publish từ các service khác.
    * **Pre-conditions:** RabbitMQ connection hoạt động bình thường.
    * **Post-conditions:** User data được cập nhật theo event.
    * **Priority:** H

* **FR-006 - User Search và Filtering:** Hệ thống PHẢI cung cấp khả năng tìm kiếm và lọc người dùng cho Admin.
    * **Description:** Admin có thể tìm kiếm user theo email, tên, hoặc các criteria khác.
    * **Trigger/Event:** Admin sử dụng search function.
    * **Pre-conditions:** Admin đã authenticate và có quyền quản lý user.
    * **Post-conditions:** Danh sách user filtered được trả về.
    * **Priority:** M

* **FR-007 - Data Export:** Hệ thống PHẢI cho phép export dữ liệu người dùng theo yêu cầu.
    * **Description:** Admin có thể export user data cho reporting hoặc compliance.
    * **Trigger/Event:** Admin request export data.
    * **Pre-conditions:** Admin có quyền export và data tồn tại.
    * **Post-conditions:** File export được tạo và download.
    * **Priority:** L

---

## 4. Assumptions & Constraints

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

## 5. Risks

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

## 6. Screens / User Interface

* **User Profile Management Screen:** Cho phép người dùng xem và chỉnh sửa thông tin cá nhân, avatar, preferences. Screen này cần validation cho các field required và format checking.

* **Watch History Screen:** Hiển thị lịch sử xem phim của người dùng với khả năng filter theo thời gian, thể loại. User có thể xóa items khỏi history và tiếp tục xem từ điểm đã dừng.

* **Favorite Movies Screen:** Quản lý danh sách phim yêu thích với khả năng add/remove, tạo multiple lists, và share lists với người khác.

* **User Statistics Dashboard:** Hiển thị thống kê cá nhân như thời gian xem, thể loại yêu thích, achievements. Dashboard cần responsive và có data visualization.

* **Admin User Management Screen:** Cho Admin xem danh sách users, search/filter, view user details, suspend/activate accounts. Screen cần pagination và bulk operations.

* **Admin Analytics Screen:** Cung cấp insights về user behavior, growth metrics, engagement statistics với charts và reports. Screen cần export functionality và customizable date ranges.

---

## 7. Technical Implementation Notes

* **Database Schema:** Design PostgreSQL schema với proper indexing cho user profile, watch history, favorites, và user statistics.

* **API Design:** Implement RESTful API với proper HTTP status codes, request/response formats, và error handling.

* **Event Handling:** Setup RabbitMQ consumers cho các events từ Auth Service, Billing Service, và Playback Service.

* **Caching Strategy:** Implement Redis caching cho frequently accessed user data để improve performance.

* **Monitoring & Logging:** Integrate với Grafana/Loki cho monitoring, alerting, và centralized logging.

* **Testing Strategy:** Unit tests, integration tests, và API tests với coverage minimum 80%.

---

## 8. Success Metrics

* API response time < 200ms for 95% of requests
* Database query performance < 100ms average
* Zero data loss events
* 99.9% service uptime
* User satisfaction score > 4.5/5 for profile management features
* Admin efficiency improvement 30% for user management tasks 