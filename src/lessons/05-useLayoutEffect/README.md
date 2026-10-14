# Lesson 05: useLayoutEffect Deep-Dive (DOM Mutation, Blocking Paint & Layout Shifts)

Tài liệu đúc kết bản chất vận hành của `useLayoutEffect` dưới nắp capo React, sự khác biệt giữa Re-render (JS) vs Paint (GPU), và nguyên lý chống Flash màn hình.

---

## 1. Bản Chất Core Dưới Nắp Capo (Render Pipeline & Event Loop)

### 📌 Biểu đồ thời gian thực thi (Timeline):
```text
1. Render Phase        : Tính toán Virtual DOM
2. Commit (Mutation)   : Gắn/sửa các thẻ HTML vào Real DOM trong bộ nhớ RAM
⚡ 3. useLayoutEffect   : [SYNC] Gọi trực tiếp trong Call Stack ➔ BLOCKING Trình duyệt vẽ!
🎨 4. Browser Paint     : GPU vẽ pixel lên màn hình cho người dùng nhìn
⏳ 5. useEffect         : [ASYNC] Đẩy vào Task Queue qua Scheduler ➔ Chạy SAU khi vẽ
```

- **Tại sao `useLayoutEffect` là Sync?**
  React gọi trực tiếp `layoutEffect.create()` trong Call Stack. JavaScript giữ chặt Main Thread, trình duyệt chưa được nhả quyền để thực hiện chu trình Layout & Paint.
- **Tại sao `useEffect` là Async?**
  React đóng gói callback vào `Scheduler.scheduleCallback` (dùng `MessageChannel`). Call Stack rỗng ➔ Trình duyệt chớp thời cơ vẽ màn hình trước ➔ Sau đó mới bốc `useEffect` ra chạy.

---

## 2. Bí Mật Senior: Render Lần 2 vs Paint Lần 2

Khi gọi `setState` bên trong Effect:

| Hook | Số lần Component Re-render (JS) | Số lần Browser Paint (Màn hình) | Trải nghiệm thị giác |
| :--- | :---: | :---: | :--- |
| **`useEffect`** | 2 lần | **2 lần** | 💥 **Bị Flash / Giật hình**: Mắt nhìn thấy vị trí cũ (0px) ở Paint 1 rồi giật sang vị trí mới (260px) ở Paint 2. |
| **`useLayoutEffect`** | 2 lần | **1 lần duy nhất** | ✨ **Mượt mà hoàn hảo**: State cũ bị đè đồng bộ trong RAM trước khi GPU kịp vẽ, chỉ vẽ kết quả cuối cùng. |

---

## 3. Khi Nào Dùng Cái Nào? (Senior Rule of Thumb)

* **99% trường hợp ➔ `useEffect`:**
  - Call API, fetch dữ liệu.
  - Lắng nghe sự kiện (`window.addEventListener`).
  - Timers (`setInterval`, `setTimeout`).
  - Ghi log analytics.
  - Cập nhật state thông thường.
  *(Giúp giao diện phản hồi nhanh 60fps/120fps, không làm đơ trang web).*

* **1% trường hợp duy nhất ➔ `useLayoutEffect`:**
  - Đo đạc kích thước DOM (`getBoundingClientRect()`, `offsetWidth`, `scrollHeight`).
  - Tính toán tọa độ động cho **Tooltip, Popover, Dropdown, Context Menu**.
  - Xử lý các hiệu ứng hoạt họa (Animation) yêu cầu không được giật khung hình đầu tiên.

---

## 4. Cảnh Báo Khi Dùng Với SSR (Next.js / Remix)

- Node.js server không có màn hình, không có DOM layout engine.
- `useLayoutEffect` không thể chạy trên server và sẽ văng cảnh báo:
  `Warning: useLayoutEffect does nothing on the server...`
- **Cách xử lý trong Next.js:** Chỉ mount component ở Client hoặc dùng custom hook `useIsomorphicLayoutEffect` (fallback sang `useEffect` khi ở server).

