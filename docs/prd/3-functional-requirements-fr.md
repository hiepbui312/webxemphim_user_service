# 3. Functional Requirements (FR)

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
