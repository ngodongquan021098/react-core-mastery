# Lesson 04: useEffect Deep-Dive (Execution Timing, Race Conditions & Anti-Patterns)

Tài liệu đúc kết bản chất vận hành của `useEffect`, phân biệt Event Handler vs Effects và các kỹ thuật xử lý bất đồng bộ chuẩn Senior.

---

## 1. Bản Chất Core Dưới Nắp Capo (Execution & Cleanup Timing)

### 📌 Luồng thực thi (Timeline):
```text
Render Phase ➔ DOM Mutation (Commit Phase) ➔ Browser Paint ➔ useEffect (Passive Effect)
```
- **Passive Effect:** React xếp lịch `useEffect` chạy thông qua Scheduler (sử dụng `MessageChannel`/`postMessage`). Nó chạy **BẤT ĐỒNG BỘ SAU KHI trình duyệt đã vẽ xong giao diện** lên màn hình. Mục tiêu: Không bao giờ làm block khung hình (đảm bảo 60fps).
- **Cleanup Timing:**
  - Khi dependencies thay đổi: Cleanup của render cũ chạy **NGAY TRƯỚC** khi effect của render mới được kích hoạt.
  - Khi component tháo khỏi DOM: Cleanup chạy khi component unmount.
  - Cleanup đóng gói (capture) biến số thuộc về lần render trước đó nhờ JavaScript Closure.

---

## 2. Xử Lý Race Condition (Bất Đồng Bộ Đè Dữ Liệu)

Khi người dùng thao tác liên tục (chuyển User 1 sang User 2): Request 1 (3000ms) có thể về sau Request 2 (800ms) và đè dữ liệu sai lên màn hình.

### Kỹ thuật 1: Boolean Flag (`ignore`)
```typescript
useEffect(() => {
  let ignore = false;
  fetchUser(userId).then(data => {
    if (!ignore) setUserData(data);
  });
  return () => { ignore = true; };
}, [userId]);
```
- **Bản chất:** Dựa vào Closure Scope độc lập của từng lần render.
- **Nhược điểm:** Chỉ chặn cập nhật React State; request mạng vẫn chạy ngầm tốn băng thông và CPU của client.

### Kỹ thuật 2: `AbortController` (Chuẩn Công Nghiệp)
```typescript
useEffect(() => {
  const controller = new AbortController();

  fetchUser(userId, { signal: controller.signal })
    .then(data => setUserData(data))
    .catch(err => {
      if (err.name === 'AbortError') {
        // Request bị hủy có chủ đích, không log lỗi
        return;
      }
      handleError(err);
    });

  return () => {
    controller.abort(); // Trình duyệt ngắt kết nối HTTP/TCP lập tức!
  };
}, [userId]);
```

---

## 3. "You Might Not Need an Effect" (Anti-Patterns Của Senior)

| Tình huống | ❌ Cách viết tồi (Lạm dụng `useEffect`) | ✅ Cách viết chuẩn Senior |
| :--- | :--- | :--- |
| **Tính toán State dẫn xuất (Derived State)** | Tạo thêm state `fullName` rồi dùng `useEffect` lắng nghe `firstName`, `lastName` để `setFullName`. *(Gây cascade 2 lần render, chớp màn hình)* | Tính toán trực tiếp trong Render: <br>`const fullName = `${firstName} ${lastName}`;` |
| **Reset State khi Props đổi (Reset Form)** | Dùng `useEffect` lắng nghe `userId` để gọi `setComment('')`. *(Gây re-render thừa, lọt dữ liệu cũ của user trước)* | Truyền `key` từ component cha: <br>`<UserProfile key={userId} userId={userId} />` *(React tự unmount instance cũ, tạo mới tinh)* |
| **Hành động của người dùng (User Action)** | Tạo cờ `isBought`, click đổi cờ thành `true`, rồi trong `useEffect` mới gọi `postOrder()`. *(Nguy hiểm: Dễ bị đặt hàng 2 lần khi re-mount/back)* | Gọi thẳng trong Event Handler: <br>`const handleBuy = () => { postOrder(); showToast(); }` |

---

## 4. Quy Tắc Vàng: Event Handler vs Effect

- **Event Handler:** Chạy vì **Người dùng thực hiện hành vi cụ thể** (Click, Submit, Drag, Gõ phím).
- **`useEffect`:** Chạy vì **Component hiển thị** và cần **Đồng bộ hóa với Hệ thống bên ngoài** (WebSocket, Event Listener toàn cục, LocalStorage, Thư viện Canvas/Map ngoài).

