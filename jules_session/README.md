# Bảng Điều Khiển Đơn Hàng Sản Xuất Thời Gian Thực (Node.js)

Ứng dụng web này cung cấp một giao diện thời gian thực để theo dõi các đơn hàng sản xuất từ cơ sở dữ liệu IBM DB2, được xây dựng bằng Node.js. Các chức năng chính bao gồm:
1.  **Thông báo đơn hàng mới:** Hiển thị các đơn hàng mới cần sản xuất trong ngày.
2.  **Theo dõi trạng thái:** Cung cấp trạng thái (OK/Delay) của các đơn hàng đã hoàn thành gần đây.

Ứng dụng tự động cập nhật và gửi thông báo trên màn hình khi có đơn hàng mới.

## Yêu Cầu Hệ Thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt:
- Node.js (phiên bản 14.x trở lên)
- npm (thường được cài đặt sẵn cùng với Node.js)
- Driver ODBC cho IBM DB2.

## Hướng Dẫn Cài Đặt

1.  **Tải mã nguồn:**
    Sao chép (clone) repository hoặc tải về mã nguồn dưới dạng tệp ZIP.

2.  **Di chuyển vào thư mục dự án:**
    ```bash
    cd /đường/dẫn/đến/dự/án
    ```

3.  **Cài đặt các thư viện cần thiết:**
    Mở terminal trong thư mục dự án và chạy lệnh sau. Lệnh này sẽ tự động tải và cài đặt các gói đã được định nghĩa trong tệp `package.json`.
    ```bash
    npm install
    ```

## Cấu Hình

### 1. Cấu Hình Kết Nối Cơ Sở Dữ Liệu

Mở tệp `server.js` và tìm đến phần "Cấu hình kết nối cơ sở dữ liệu".

Chuỗi kết nối đến DB2 đã được thiết lập sẵn dựa trên thông tin bạn cung cấp. Tuy nhiên, để tăng cường bảo mật, bạn nên sử dụng biến môi trường để lưu trữ chuỗi kết nối này thay vì viết trực tiếp vào mã nguồn.

**Cách dùng biến môi trường (khuyến khích):**
Đặt một biến môi trường tên là `DB_CONN_STR` với giá trị là chuỗi kết nối của bạn. Ứng dụng sẽ tự động ưu tiên sử dụng biến này nếu nó tồn tại.

### 2. Tùy Chỉnh Câu Lệnh SQL (nếu cần)

Các câu lệnh SQL để truy vấn dữ liệu được đặt trong các route `/api/new_orders` và `/api/completed_status` trong tệp `server.js`. Bạn có thể chỉnh sửa các câu lệnh này nếu cấu trúc bảng của bạn có thay đổi.

## Chạy Ứng Dụng

Sau khi hoàn tất cấu hình, chạy ứng dụng bằng lệnh sau:

```bash
npm start
```
Hoặc:
```bash
node server.js
```

Ứng dụng sẽ khởi động một máy chủ cục bộ, thường có địa chỉ là `http://localhost:3000`.

## Cách Sử Dụng

1.  Mở trình duyệt web và truy cập vào địa chỉ `http://localhost:3000`.
2.  Trình duyệt sẽ hỏi xin quyền hiển thị thông báo. Hãy chọn **"Allow" (Cho phép)** để nhận được thông báo pop-up trên màn hình khi có đơn hàng mới.
3.  Giao diện sẽ hiển thị hai bảng:
    *   Bảng bên trái chứa danh sách các đơn hàng mới cần sản xuất trong ngày.
    *   Bảng bên phải hiển thị trạng thái của các đơn hàng đã hoàn thành trong 7 ngày gần nhất.
4.  Dữ liệu sẽ tự động được làm mới sau mỗi 15 giây.
