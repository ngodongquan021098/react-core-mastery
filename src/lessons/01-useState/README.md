# Lesson 01: useState Deep-Dive (Senior Mental Model)

Tài liệu đúc kết bản chất vận hành của `useState` dưới nắp capo React, giúp ôn tập nhanh và chuẩn bị phỏng vấn Senior/Lead.

---

## 1. Bản Chất Core Dưới Nắp Capo (Fiber Internals)

1. **Fiber Hooks Linked List:**
   - Trong React Fiber, các hook của một component được lưu dưới dạng danh sách liên kết đơn:
     ```text
     fiber.memoizedState -> hook1 -> hook2 -> hook3 -> null
     ```
   - React phân biệt các hook bằng **thứ tự gọi tuần tự (call order)**, không phải bằng tên biến. Đó là lý do không được đặt hook trong `if/else` hoặc vòng lặp.

2. **Mount phase vs Update phase:**
   - **Mount:** Gọi `mountState(initialValue)` ➡️ Tạo hook node, khởi tạo giá trị và hàm `dispatch`.
   - **Update:** Gọi `updateState()` ➡️ Duyệt qua hàng đợi các update (`UpdateQueue`) để tính state mới.

---

## 2. Ba Trụ Cột Thực Chiến Cần Nhớ

### 📌 Trụ cột 1: Snapshot Closure vs Functional Update

* **Hiện tượng (Stale Closure):**
  - Function Component trong React chạy lại như một hàm JS bình thường ở mỗi lần render.
  - Biến state là một **hằng số (snapshot)** của riêng lần render đó.
  - Khi dùng `setTimeout`, `Promise`, hoặc callback bất đồng bộ: closure sẽ "chụp ảnh" giá trị state tại thời điểm sinh ra hàm.

```typescript
// ❌ BỊ BUG (Stale Closure): Đọc biến count bị đóng băng trong closure
setTimeout(() => {
  setCount(count + 1); 
}, 3000);

// ✅ CHUẨN XÁC (Functional Update): Lấy giá trị mới nhất từ Fiber UpdateQueue
setTimeout(() => {
  setCount((prevCount) => prevCount + 1);
}, 3000);
```

* **Quy tắc Senior:**
  - Nếu state tiếp theo **phụ thuộc vào state trước đó**, hoặc nằm trong **callback bất đồng bộ/event listener**, **LUÔN DÙNG** `setState(prev => ...)`.

---

### 📌 Trụ cột 2: Automatic Batching & `flushSync`

* **Cơ chế Automatic Batching (React 18 & 19):**
  - Dù gọi nhiều `setState` trong click handler, `setTimeout`, `Promise`, hay native event: React đều gom lại đưa vào **Microtask Queue** và chỉ re-render **1 LẦN DUY NHẤT**.

* **Khi nào dùng `flushSync`?**
  - `flushSync` ép React **tạm dừng luồng code, re-render đồng bộ ngay lập tức và vẽ lên DOM thật** trước khi chạy dòng code tiếp theo.
  - **Ứng dụng thực tế duy nhất:** Cần tương tác với DOM thật ngay sau khi đổi state (ví dụ: cuộn khung chat xuống đáy, đo kích thước phần tử vừa render, tích hợp thư viện ngoài như D3/Leaflet).

```typescript
import { flushSync } from 'react-dom';

// Ép vẽ tin nhắn mới lên DOM ngay lập tức:
flushSync(() => {
  setMessages(prev => [...prev, newMsg]);
});

// Đến dòng này, DOM thật ĐÃ có tin nhắn mới -> Cuộn chính xác 100%:
chatRef.current.scrollTop = chatRef.current.scrollHeight;
```

> ⚠️ **Lưu ý cốt lõi:** Sau `flushSync`, DOM đã update, nhưng biến state trong phạm vi hàm hiện tại vẫn là giá trị cũ do JavaScript Lexical Scope!

---

### 📌 Trụ cột 3: Thuật toán `Object.is` & Cơ chế Bailout

* React **KHÔNG BAO GIỜ deep compare** (so sánh từng thuộc tính con của object) vì tốn CPU.
* React chỉ so sánh tham chiếu (Reference Equality) bằng `Object.is(prevState, nextState)`.

```typescript
// ❌ BỊ BUG (Bailout): Mutate in-place, cùng địa chỉ RAM
user.role = "Fullstack";
setUser(user); 
// -> Object.is(old, new) === true -> React BAILOUT (bỏ qua không render)!

// ✅ CHUẨN XÁC: Tạo object mới trong RAM
setUser({ ...user, role: "Fullstack" });
// -> Object.is(old, new) === false -> React kích hoạt Re-render.
```

---

## 3. Câu Hỏi Phỏng Vấn Senior "Tủ"

| Câu hỏi | Điểm mấu chốt để trả lời ăn trọn điểm |
| :--- | :--- |
| **Tại sao không được gọi Hook trong `if/else`?** | Vì React lưu hook theo Linked List trên Fiber node và dựa vào **thứ tự gọi** (`hook.next`). Nếu đặt trong điều kiện rẽ nhánh, con trỏ hook sẽ trỏ sai vị trí làm hỏng state tree. |
| **Tại sao `user.name = "X"; setUser(user)` không re-render?** | Do cơ chế **Bailout Optimization**: React dùng `Object.is` so sánh tham chiếu ô nhớ. Cùng ô nhớ thì React hủy bỏ render để tối ưu hiệu năng. |
| **Sự khác nhau giữa Batching ở React 17 và React 18?** | React 17 chỉ batch trong React Synthetic Events (`onClick`). React 18 dùng Concurrent Scheduler đưa mọi update vào microtask nên tự động batch ở mọi nơi (`setTimeout`, `Promise`, native events). |
| **`flushSync` hoạt động như thế nào?** | Nó ép quá trình render và commit DOM diễn ra **đồng bộ (synchronous blocking)** ngay tại dòng gọi thay vì đợi microtask. Dùng khi cần đọc DOM thật ngay lập tức. |

