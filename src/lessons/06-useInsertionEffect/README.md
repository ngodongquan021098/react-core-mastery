# Lesson 06: useInsertionEffect Deep-Dive (CSS-in-JS & Style Injection Pipeline)

Tài liệu đúc kết bản chất vận hành của `useInsertionEffect` (React 18+), so sánh toàn diện 3 hook Effect của React và cách giải quyết bài toán Recalculate Style.

---

## 1. Bản Chất Core Dưới Nắp Capo (Style Injection Timing)

### 📌 Vị trí đứng của 3 anh em nhà Effect trong Render Pipeline:
```text
1. RENDER PHASE          : Chạy hàm component, tính toán Virtual DOM
⚡ 2. useInsertionEffect : [SYNC] Chạy TRƯỚC khi React chạm vào Real DOM! (DOM thật chưa gắn)
-----------------------------------------------------------------------------------
3. MUTATION PHASE        : React gắn/sửa các thẻ HTML vào Real DOM (trong RAM)
-----------------------------------------------------------------------------------
⚡ 4. useLayoutEffect    : [SYNC] Chạy SAU khi DOM đã gắn, nhưng TRƯỚC khi Browser Paint!
🎨 5. BROWSER PAINT      : GPU vẽ pixel lên màn hình cho người dùng nhìn
⏳ 6. useEffect          : [ASYNC] Chạy SAU khi màn hình đã vẽ xong hoàn toàn
```

---

## 2. Tại Sao React 18 Phải Tạo Ra `useInsertionEffect`?

* **Vấn đề của CSS-in-JS cũ (styled-components / Emotion):**
  - Trước React 18, các thư viện bơm thẻ `<style>` động vào `<head>` trong `useLayoutEffect` hoặc `useEffect`.
  - Lúc này, trình duyệt vừa tính toán xong vị trí và kích thước các phần tử trong DOM.
  - Việc nhét thêm thẻ `<style>` vào ép trình duyệt phải **Recalculate Style (Tính toán lại toàn bộ CSS rules cho cả trang web)** ở mỗi khung hình ➔ Tụt fps, giật lag nghiêm trọng khi render nhiều component.

* **Giải pháp của `useInsertionEffect`:**
  - Bơm thẻ `<style>` vào `<head>` **trước khi React thực hiện bất kỳ thao tác gắn DOM nào**.
  - Khi React bắt đầu gắn thẻ HTML và trình duyệt bắt đầu tính toán layout, các CSS Rules đã nằm sẵn ở đó ➔ Trình duyệt chỉ cần tính toán đúng **1 lần duy nhất**!

---

## 3. Hai Điều Cấm Kỵ Của `useInsertionEffect`

1. ❌ **Không được truy cập `ref`:** Vì tại thời điểm hook này chạy, React **chưa hề gắn thẻ HTML vào DOM**, nên `ref.current` luôn luôn là `null`.
2. ❌ **Không được gọi `setState`:** Mục đích thuần túy của nó là bơm CSS/rules vào DOM, không được phép kích hoạt một chu trình re-render mới tại thời điểm này.

---

## 4. Bảng So Sánh Tổng Kết Toàn Diện 3 Hook Effect (Senior Cheat-Sheet)

| Tiêu chí | `useInsertionEffect` | `useLayoutEffect` | `useEffect` |
| :--- | :---: | :---: | :---: |
| **Thời điểm chạy** | Trước khi React gắn DOM | Sau khi gắn DOM, trước Paint | Sau khi Browser Paint xong |
| **Tính chất** | Đồng bộ (Synchronous) | Đồng bộ (Synchronous) | Bất đồng bộ (Asynchronous) |
| **Chặn Browser Paint?** | Có (Blocking) | Có (Blocking) | Không (Non-blocking) |
| **Truy cập được DOM `ref`?** | ❌ Không (`ref` là `null`) | ✅ Có | ✅ Có |
| **Mục đích chính** | Bơm CSS/`<style>` cho thư viện CSS-in-JS | Đo đạc DOM, chống giật hình Tooltip/Popover | Call API, Event Listener, Timer, Sync hệ thống ngoài |
| **Tần suất sử dụng** | Rất hiếm (< 0.1%) | Hiếm (~ 1%) | Mặc định (99%) |

