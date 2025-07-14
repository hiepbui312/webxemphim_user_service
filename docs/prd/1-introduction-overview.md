# 1. Introduction / Overview

* **Project Summary:** User Service là một microservice trong hệ thống Movie Streaming Platform, chịu trách nhiệm quản lý thông tin người dùng, profile, lịch sử xem phim và các tính năng liên quan đến tài khoản người dùng.

* **Detailed Overview:** User Service được xây dựng trên Node.js với NestJS framework, sử dụng PostgreSQL làm cơ sở dữ liệu chính để lưu trữ thông tin người dùng. Service này tích hợp với các service khác trong hệ thống thông qua RabbitMQ message broker và cung cấp REST API thông qua API Gateway. User Service không chỉ quản lý thông tin cá nhân mà còn theo dõi hành vi người dùng, lịch sử xem phim, và hỗ trợ các tính năng cá nhân hóa như danh sách yêu thích và gợi ý phim.

---
