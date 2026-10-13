# Lesson 03: `useRef` Deep-Dive

## 1. Bản chất cốt lõi (React Internals & Fiber)
- **Fiber node:** Khi mount `useRef(initialValue)`, React tạo một Plain JS Object:
  ```js
  hook.memoizedState = { current: initialValue };
  ```
- **Tại sao `ref.current = newValue` không làm Re-render?**
  - Không đi qua `dispatchSetState`.
  - Không tạo `Update` object trong `hook.queue`.
  - Không gửi tín hiệu cho React Scheduler (`scheduleUpdateOnFiber`).
  - Đây chỉ là một phép gán thuộc tính thuần túy trong JavaScript.

---

## 2. Hai vai trò chính của `useRef`
1. **DOM Escape Hatch**: Trỏ trực tiếp vào DOM node để gọi native APIs (`focus()`, `scrollIntoView()`, đo kích thước `getBoundingClientRect()`).
2. **Mutable Instance Variable**: Lưu trữ dữ liệu sống sót qua các lần render mà không kích hoạt re-render (như `timerId`, `previousValue`, cờ `isMounted`).

---

## 3. Các bẫy kinh điển (Senior Traps & Solutions)

### Bẫy 1: Vi phạm Rule of Purity (Đọc/ghi ref trong Render Phase)
- **Sai lầm:** Đọc/ghi `ref.current` trực tiếp trong thân hàm component.
- **Hậu quả:** 
  - Trong Strict Mode (Dev), hàm bị gọi 2 lần ➔ giá trị bị ghi đè / nhảy số sai lệch.
  - Trong Concurrent React, render phase có thể bị hủy (abort) hoặc restart ➔ mutation không thể rollback, gây rò rỉ hoặc state bất nhất (tearing).
- **Quy tắc:** Chỉ đọc/ghi `ref.current` trong **Event Handlers** hoặc **Commit Phase (`useEffect`)**.

### Bẫy 2: Spam Click Timer & Memory Leak
- Khi click Start liên tục, nếu không kiểm tra `if (timerId.current) return;`, mỗi lần click sẽ tạo một interval mới và ghi đè `timerId.current`.
- Các interval cũ trở thành **"mồ côi" (orphaned timers)**, chạy ngầm liên tục và không thể `clearInterval`.

### Bẫy 3: Quên dọn dẹp khi Unmount
- Khi component bị tháo khỏi DOM (chuyển trang, unmount), timer vẫn tiếp tục chạy ngầm trong browser.
- **Giải pháp:** Luôn có cleanup function trong `useEffect`:
  ```tsx
  useEffect(() => {
    return () => {
      if (timerId.current) clearInterval(timerId.current);
    };
  }, []);
  ```

### Bẫy 4: Chuyển tab trình duyệt (Browser Lifecycle vs React Lifecycle)
- **Hiểu lầm:** Tưởng rằng chuyển tab thì component unmount ➔ **Sai!** Component vẫn tồn tại trong RAM.
- **Vấn đề thực tế:** Trình duyệt sẽ **throttle** (kéo giãn tần suất) của `setInterval` ở tab nền để tiết kiệm pin/CPU ➔ Đồng hồ bị chạy chậm và sai lệch.
- **Giải pháp 1 (Page Visibility API):** Lắng nghe `visibilitychange`. Dùng thêm 1 cờ `wasRunningRef` để **chỉ resume nếu trước đó người dùng đang bật timer**:
  ```tsx
  if (document.hidden) {
    if (timerId.current) {
      wasRunningRef.current = true;
      handleClickEnd();
    }
  } else {
    if (wasRunningRef.current) {
      handleClickStart();
      wasRunningRef.current = false;
    }
  }
  ```
- **Giải pháp 2 (Delta Time - Senior Standard):** Dùng `useRef` lưu `startTime = Date.now()`, mỗi lần tick tính `Math.floor((Date.now() - startTime) / 1000)`. Đồng hồ luôn chuẩn xác 100% thời gian thực dù tab có bị throttle hay freeze.

---

## 4. Render Phase vs Commit Phase
- **Render Phase (Thân hàm):** Tính toán Virtual DOM / JSX tree. Có thể chạy nhiều lần, có thể bị ngắt quãng hoặc hủy bỏ.
- **Commit Phase (`useEffect`):** Đưa thay đổi lên DOM thực tế. Đo biến đếm trong `useEffect` đại diện cho **số lần Committed Renders**.
