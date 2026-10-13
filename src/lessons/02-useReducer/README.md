# Lesson 02: useReducer Deep-Dive (Architectural Purity & State Machines)

Tài liệu đúc kết bản chất vận hành của `useReducer` dưới nắp capo React, sự liên hệ với `useState` và cách thiết kế kiến trúc tránh Impossible States.

---

## 1. Bản Chất Core Dưới Nắp Capo (Fiber Internals)

1. **`useState` được xây dựng trên `useReducer`:**
   - Trong source code của React (`ReactFiberHooks.js`), `useState` thực chất chỉ là một wrapper gọi ngầm `useReducer` với một hàm `basicStateReducer`:
     ```javascript
     function basicStateReducer(state, action) {
       return typeof action === 'function' ? action(state) : action;
     }
     ```
   - Cả 2 hook đều dùng chung cấu trúc hàng đợi `UpdateQueue` (Circular Linked List) trong Fiber node.

2. **Dispatch Identity Stability (Tính ổn định tham chiếu):**
   - React cam kết đối tượng `dispatch` sinh ra từ `useReducer` **giữ nguyên địa chỉ tham chiếu (referentially stable) vĩnh viễn** trong suốt vòng đời component.
   - **Lợi ích kiến trúc:** Truyền `dispatch` xuống cây component con kết hợp `React.memo` sẽ **không bao giờ gây re-render thừa**, không cần bọc `useCallback`.

---

## 2. Hai Trụ Cột Thực Chiến Cần Nhớ

### 📌 Trụ cột 1: Finite State Machine (Tránh "Impossible States")

* **Vấn đề khi lạm dụng nhiều `useState` độc lập:**
  ```typescript
  // Dễ sinh ra trạng thái vô lý: vừa loading vừa có error vừa có data cũ!
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  ```

* **Giải pháp với `useReducer`:**
  - Quy định rõ ràng các trạng thái loại trừ lẫn nhau:
    `status: 'idle' | 'loading' | 'success' | 'error'`
  - Mỗi action (`FETCH_START`, `FETCH_SUCCESS`, `FETCH_ERROR`) chuyển đổi trạng thái một cách xác định (deterministic).

---

### 📌 Trụ cột 2: Lazy Initializer & Clean Reset Pattern

* Tham số thứ 3 của `useReducer(reducer, initialArg, init)` cho phép chạy hàm `init(initialArg)` để khởi tạo state ở mount phase.
* **Mẫu thiết kế Clean Reset:**
  ```typescript
  const init = (initialState: FetchState): FetchState => {
    return { ...initialState }; // Defensive copying: tránh mutate singleton module
  };

  const reducer = (state: FetchState, action: Action): FetchState => {
    switch (action.type) {
      // ...
      case 'RESET':
        return init(initState); // Tái sử dụng init để reset sạch sẽ
    }
  };
  ```

---

## 3. Câu Hỏi Phỏng Vấn Senior "Tủ"

| Câu hỏi | Điểm mấu chốt để trả lời ăn trọn điểm |
| :--- | :--- |
| **Khi nào nên dùng `useReducer` thay vì `useState`?** | 1. Khi state phức tạp, nhiều biến phụ thuộc lẫn nhau.<br>2. Khi muốn tránh "Impossible States" bằng Finite State Machine.<br>3. Khi muốn tối ưu hiệu năng truyền props xuống sâu mà không cần bọc `useCallback`.<br>4. Khi muốn unit test business logic độc lập mà không cần mount React component. |
| **Tại sao `dispatch` không cần đưa vào dependency array của `useEffect`?** | Vì React spec cam kết `dispatch` có tính ổn định tham chiếu trọn đời (Identity Stability), không bao giờ đổi con trỏ bộ nhớ giữa các lần render. |
| **Tại sao trong Strict Mode hàm Reducer chạy 2 lần?** | Reducer bắt buộc phải là Pure Function (không side-effect). React cố ý chạy 2 lần ở Dev để kiểm tra xem Reducer có bị impure (như mutate state trực tiếp, ghi đè biến ngoài scope) hay không. |

