# REACT CORE MASTERY - TIẾN ĐỘ & TÀI LIỆU TIẾP TỤC HỌC TẬP

> Tài liệu lưu trạng thái học tập để chuyển đổi mượt mà giữa các máy tính hoặc tiếp tục trên bất kỳ IDE/AI nào.

---

## 🚀 PROMPT CHUẨN ĐỂ COPY-PASTE KHI BẮT ĐẦU THREAD MỚI

Khi bạn mở máy tính cá nhân hoặc mở một đoạn chat mới, chỉ cần **copy nguyên văn đoạn prompt dưới đây** và gửi cho AI:

```markdown
Chào bạn, mình là Senior Developer (5 năm kinh nghiệm React, vừa làm Backend 1 năm nên đang ôn tập lại chuyên sâu React Core để lấy lại phong độ Senior thực thụ). 

Chúng ta đang cùng nhau thực hiện chuỗi đào tạo "React Core Mastery" 1-on-1 theo phương pháp Mentor.
Hiện tại trong source code đã hoàn thành:
- Lesson 01: useState (đã có code trong src/lessons/01-useState và README.md)
- Lesson 02: useReducer (đã có code trong src/lessons/02-useReducer và README.md)

Bạn hãy đọc file PROGRESS.md ở thư mục gốc để nắm tiến độ và tuân thủ các NGUYÊN TẮC LÀM VIỆC sau:
1. Đóng vai Senior/Staff React Mentor am hiểu cực sâu về React Internals (Fiber, Reconciliation, Scheduler, Closures).
2. KHÔNG TỰ Ý CODE HỘ: Bạn chỉ đưa ra Core concept và đề bài thử thách (case cơ bản -> bẫy senior -> cách fix), mình sẽ là người tự gõ từng dòng code.
3. KHI HỎI ĐÁP: Hỏi từng câu một, đợi mình trả lời xong và chốt dứt điểm mới giao task tiếp theo.
4. Mỗi khi kết thúc một bài, hỗ trợ tạo 1 file README.md ngắn gọn, súc tích trong folder bài đó để sau này ôn tập.

Bây giờ chúng ta đang ở LESSON 03: useRef. Hãy đọc nội dung đề bài của Lesson 03 trong PROGRESS.md và bắt đầu hướng dẫn mình nhé!
```

---

## 📋 NGUYÊN TẮC PHƯƠNG PHÁP MENTOR 1-ON-1 (ĐÃ THỐNG NHẤT)
1. **Tư duy từ bản chất:** Luôn nhìn nhận hook dưới góc độ Fiber Architecture, JavaScript Closures, Event Loop, và Microtask Queue.
2. **Học qua Bug thực tế:** Tái hiện các bẫy Senior hay ngã ngựa (Stale closure, race condition, tearing, bailout, unnecessary re-render).
3. **Tương tác từng bước:** Mentor đưa câu hỏi -> Học viên trả lời -> Mentor phản biện/chốt hạ -> Chuyển bước kế tiếp.
4. **Code độc lập theo từng folder:** Mỗi bài 1 folder riêng biệt kèm file `README.md` đúc kết lý thuyết.

---

## 🗺️ LỘ TRÌNH TỔNG THỂ & TIẾN ĐỘ

### Phase 1: State Primitives & Identity
- [x] **Lesson 01: `useState`** (Fiber Linked List, Stale Closure, Automatic Batching, `flushSync`, `Object.is` & Bailout).
- [x] **Lesson 02: `useReducer`** (State Machine, Dispatch Identity Stability, Lazy Initializer, Clean Reset Pattern).
- [ ] **Lesson 03: `useRef`** ⏳ *(ĐANG THỰC HIỆN DỞ DANG)*

### Phase 2: Side-Effect & Render Phase Engine
- [ ] **Lesson 04: `useEffect`** (Passive Effect, Cleanup Timing, Race Condition & AbortController, "You Might Not Need an Effect").
- [ ] **Lesson 05: `useLayoutEffect`** (Synchronous DOM Mutation Phase, Flashing Prevention, Layout Shift vs `useEffect`).
- [ ] **Lesson 06: `useInsertionEffect`** (CSS-in-JS Engine, Run before DOM mutation, Purity restrictions).

### Phase 3: Memoization & Referential Stability
- [ ] **Lesson 07: `useMemo`** (Cache Invalidation, Cost vs Benefit, Khi nào KHÔNG nên memo).
- [ ] **Lesson 08: `useCallback`** (Bẫy Stale Closure trong memoized callback, Function identity).
- [ ] **Lesson 09: `React.memo`** (Shallow Prop Comparison, Custom `arePropsEqual`, Vỡ memo do inline object/children).

### Phase 4: Component Communication & DOM Interop
- [ ] **Lesson 10: `useContext`** (Context Dependency Propagation, Bypass Memoization, Tách State vs Dispatch Context).
- [ ] **Lesson 11: `useImperativeHandle`** (Encapsulation, Exposing DOM API cho Parent Component).
- [ ] **Lesson 12: `useId`** (SSR Hydration Deterministic ID generation, Accessible Forms).

### Phase 5: Concurrent React & External State Tearing
- [ ] **Lesson 13: `useTransition`** (Interruptible Rendering, Transition Lane, Giữ UI phản hồi khi render nặng).
- [ ] **Lesson 14: `useDeferredValue`** (Cooperative frame rate, Khác biệt bản chất với `useTransition`).
- [ ] **Lesson 15: `useSyncExternalStore`** (Giải quyết triệt để lỗi Tearing trong Concurrent Mode cho Redux/Zustand/Window events).

### Phase 6: React 19 Modern Era
- [ ] **Lesson 16: `useActionState`** (Xử lý Forms & Async Actions, tự động quản lý pending/error/data).
- [ ] **Lesson 17: `useOptimistic`** (Cập nhật giao diện lập tức trước khi server phản hồi, tự rollback nếu lỗi).
- [ ] **Lesson 18: `use()` API** (Đọc Promise & Context bên trong vòng lặp/điều kiện, tích hợp Suspense).

### Phase 7: React Internals & Architecture
- [ ] **Lesson 19: Fiber Architecture Deep-Dive** (WorkInProgress Tree, Double Buffering, Render Phase vs Commit Phase).
- [ ] **Lesson 20: Senior Custom Hook Design System** (Composition pattern, Headless logic, Generics TypeScript).

---

## 📌 NỘI DUNG HIỆN TẠI ĐANG DỞ: LESSON 03 (`useRef`)

### 1. Kiến thức Core cần nắm:
- **Fiber node:** `hook.memoizedState = { current: initialValue }`.
- Thay đổi `ref.current` **KHÔNG** kích hoạt Scheduler, **KHÔNG** tạo Update Queue, **KHÔNG** làm re-render.
- **2 vai trò chính:**
  - *Vai trò 1:* DOM Escape Hatch (Focus, đo kích thước, cuộn trang).
  - *Vai trò 2:* Mutable Instance Variable (Lưu timerId của `setInterval`, cờ `isMounted`, dữ liệu sống sót qua các lần render).
- **Quy tắc vàng (Rule of Purity):** Tuyệt đối **không đọc/ghi `ref.current` trong Render Phase** (thân hàm component). Chỉ đọc/ghi trong Event Handler hoặc `useEffect`.

### 2. Đề bài Challenge đang chờ thực hiện:
Tạo file: `src/lessons/03-useRef/useRefLab.tsx`.

Xây dựng ứng dụng **"Đồng hồ bấm giờ (Stopwatch) & DOM Focus"**:
1. **Giao diện:**
   - 1 biến `seconds` hiển thị số giây đang đếm (`useState`).
   - 1 input text để nhập "Ghi chú vòng chạy".
   - 1 dòng chữ: `Số lần Component Re-render: X`.
   - 3 nút bấm:
     - **Bắt đầu (Start):** Kích hoạt `setInterval` tăng `seconds` mỗi giây.
     - **Dừng (Stop):** Dừng `setInterval`.
     - **Reset & Focus:** Đưa `seconds` về 0, hủy timer, và **tự động focus con trỏ chuột vào ô input ghi chú**.
2. **Thử thách kiến trúc:**
   - Dùng `useRef` thứ 1 để lưu trữ `timerId` (tránh lưu vào state gây render thừa, và tránh dùng biến thường bị reset sau mỗi render).
   - Dùng `useRef` thứ 2 để trỏ vào thẻ `<input>` (DOM Node).
   - Đo số lần component re-render bằng cách nào an toàn nhất? (Tự trả lời khi viết code).

