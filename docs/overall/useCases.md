# Movie Streaming System - Use Cases

## Actors Overview

### Primary Actors (Người dùng chính)
- **Guest User**: Khách vãng lai chưa đăng ký tài khoản
- **Registered User**: Người dùng đã đăng ký và đăng nhập
- **Admin**: Quản trị viên hệ thống

### Secondary Actors (Hệ thống bên ngoài)
- **Payment Gateway**: Cổng thanh toán trực tuyến
- **CDN Service**: Dịch vụ phân phối nội dung
- **Email Service**: Dịch vụ gửi email
- **SMS Service**: Dịch vụ gửi tin nhắn

### System Actors (Thành phần hệ thống)
- **Scheduler Service**: Dịch vụ lập lịch tự động
- **Monitoring Service**: Dịch vụ giám sát hệ thống
- **Backup Service**: Dịch vụ sao lưu dữ liệu

---

## Use Cases by Actor

### 1. Guest User (Khách vãng lai)

**Authentication & Registration**
- UC-G001: Đăng ký tài khoản mới
- UC-G002: Đăng nhập vào hệ thống
- UC-G003: Quên mật khẩu
- UC-G004: Xác thực email đăng ký

**Browse & Discovery**
- UC-G005: Xem danh sách phim công khai
- UC-G006: Xem thông tin chi tiết phim
- UC-G007: Xem trailer phim
- UC-G008: Tìm kiếm phim theo tên
- UC-G009: Lọc phim theo thể loại
- UC-G010: Xem top phim hot/mới nhất

### 2. Registered User (Người dùng đã đăng ký)

**Account Management**
- UC-R001: Đăng nhập/đăng xuất
- UC-R002: Xem và chỉnh sửa profile
- UC-R003: Đổi mật khẩu
- UC-R004: Xem lịch sử giao dịch
- UC-R005: Xem lịch sử xem phim

**Payment & Token Management**
- UC-R006: Nạp tiền vào tài khoản
- UC-R007: Mua token xem phim
- UC-R008: Xem số dư token hiện tại
- UC-R009: Xem lịch sử sử dụng token

**Movie Watching**
- UC-R010: Xem phim (tiêu thụ token)
- UC-R011: Tạm dừng/tiếp tục phim
- UC-R012: Điều chỉnh chất lượng video
- UC-R013: Lưu thời điểm xem để xem tiếp

**Social Features**
- UC-R014: Đánh giá phim (rating)
- UC-R015: Viết bình luận phim
- UC-R016: Tạo danh sách phim yêu thích

**Search & Discovery**
- UC-R017: Tìm kiếm phim nâng cao
- UC-R018: Xem phim đề xuất cá nhân hóa
- UC-R019: Lọc phim theo nhiều tiêu chí
- UC-R020: Xem thống kê cá nhân

### 3. Admin (Quản trị viên)

**Movie Management**
- UC-A001: Upload phim mới
- UC-A002: Chỉnh sửa thông tin phim
- UC-A003: Xóa phim
- UC-A004: Quản lý thể loại phim
- UC-A005: Thiết lập giá token cho phim
- UC-A006: Quản lý chất lượng video

**User Management**
- UC-A007: Xem danh sách người dùng
- UC-A008: Khóa/mở khóa tài khoản
- UC-A009: Xem thông tin chi tiết user
- UC-A010: Quản lý quyền người dùng
- UC-A011: Xem hoạt động của user

**System Configuration**
- UC-A012: Cấu hình giá token
- UC-A013: Thiết lập khuyến mãi
- UC-A014: Quản lý cấu hình thanh toán
- UC-A015: Cấu hình email template
- UC-A016: Thiết lập thông báo hệ thống

**Analytics & Reports**
- UC-A017: Xem báo cáo doanh thu
- UC-A018: Thống kê lượt xem phim
- UC-A019: Phân tích hành vi người dùng
- UC-A020: Xuất báo cáo Excel/PDF
- UC-A021: Xem dashboard tổng quan

**Content Management**
- UC-A022: Quản lý banner/poster
- UC-A023: Tạo và quản lý trailer
- UC-A024: Quản lý nội dung trang chủ
- UC-A025: Kiểm duyệt bình luận

### 4. Payment Gateway (Cổng thanh toán)

**Transaction Processing**
- UC-P001: Xử lý yêu cầu thanh toán
- UC-P002: Xác thực thông tin thanh toán
- UC-P003: Gửi kết quả giao dịch về hệ thống
- UC-P004: Xử lý hoàn tiền
- UC-P005: Gửi webhook xác nhận

### 5. CDN Service (Dịch vụ CDN)

**Content Delivery**
- UC-C001: Lưu trữ video files
- UC-C002: Phân phối video streaming
- UC-C003: Tối ưu tốc độ tải
- UC-C004: Adaptive bitrate streaming
- UC-C005: Cache management

### 6. Email Service (Dịch vụ Email)

**Email Communications**
- UC-E001: Gửi email xác thực đăng ký
- UC-E002: Gửi email reset password
- UC-E003: Thông báo giao dịch thành công
- UC-E004: Gửi email khuyến mãi
- UC-E005: Thông báo phim mới

### 7. SMS Service (Dịch vụ SMS)

**SMS Communications**
- UC-S001: Gửi OTP xác thực
- UC-S002: Thông báo giao dịch
- UC-S003: Cảnh báo bảo mật tài khoản
- UC-S004: Thông báo khuyến mãi

### 8. Scheduler Service (Dịch vụ lập lịch)

**Automated Tasks**
- UC-SC001: Tự động xóa dữ liệu cũ
- UC-SC002: Tạo báo cáo định kỳ
- UC-SC003: Backup dữ liệu theo lịch
- UC-SC004: Gửi email marketing định kỳ
- UC-SC005: Cập nhật thống kê hàng ngày

### 9. Monitoring Service (Dịch vụ giám sát)

**System Monitoring**
- UC-M001: Giám sát hiệu suất hệ thống
- UC-M002: Phát hiện và cảnh báo lỗi
- UC-M003: Theo dõi tài nguyên server
- UC-M004: Giám sát chất lượng streaming
- UC-M005: Tạo log và metrics

### 10. Backup Service (Dịch vụ sao lưu)

**Data Backup**
- UC-B001: Sao lưu database định kỳ
- UC-B002: Sao lưu file video
- UC-B003: Khôi phục dữ liệu khi cần
- UC-B004: Kiểm tra tính toàn vẹn backup
- UC-B005: Quản lý vòng đời backup

---

## Use Case Priorities

### High Priority (Must Have)
- Authentication & Registration (UC-G001 to UC-G004)
- Movie watching core features (UC-R010 to UC-R013)
- Payment & Token management (UC-R006 to UC-R009)
- Admin movie management (UC-A001 to UC-A006)
- Payment processing (UC-P001 to UC-P003)

### Medium Priority (Should Have)
- Social features (UC-R014 to UC-R018)
- Admin analytics (UC-A017 to UC-A021)
- Advanced search (UC-R019 to UC-R022)
- System configuration (UC-A012 to UC-A016)

### Low Priority (Could Have)
- Advanced social features
- Detailed analytics
- Marketing automation
- Advanced content management

---

## Notes
- Tất cả use cases cần được implement với proper error handling
- Security và authentication cần được áp dụng cho tất cả sensitive operations
- Logging và monitoring cần được tích hợp cho tất cả use cases
- Rate limiting cần được áp dụng cho các API endpoints