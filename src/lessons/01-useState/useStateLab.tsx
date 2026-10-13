import React from "react";
import { flushSync } from "react-dom";

export const UseStateLab = () => {
  const [count, setCount] = React.useState(0);
  const [name, setName] = React.useState("Alex");
  const [age, setAge] = React.useState(20);

  // Trước React 18, nếu bạn gọi nhiều setState bên trong setTimeout hoặc Promise, React sẽ render lại component sau mỗi dòng setState. Từ React 18 & 19, React áp dụng Automatic Batching (gom tất cả lại để chỉ render 1 lần duy nhất).

  console.log("🔥 Component vừa Re-render!");

  const handleClick = () => {
    setCount(count + 1);
  }

  const handleClickWithDelay = () => {
    setTimeout(() => {
      setCount(count + 1);
    }, 3000);
  }

  // Viết 1 hàm thứ hai sửa triệt để bug này bằng Functional Update.
  const handleClickWithDelayFix = () => {
    setTimeout(() => {
      setCount((prevCount) => prevCount + 1);
    }, 3000);
  }

  // JavaScript Closure Snapshot: Function component trong React thực chất chỉ là một hàm thuần túy được gọi đi gọi lại. Ở mỗi lần render, biến count là một giá trị cố định (snapshot) của riêng lần render đó. setTimeout đã "chụp ảnh" và lưu giữ biến count của thời điểm click.

  // Fiber Update Queue: Khi bạn truyền (prevCount) => prevCount + 1, React lưu cái hàm này vào một hàng đợi liên kết (UpdateQueue trong Fiber node). Khi React xử lý cập nhật, nó lấy giá trị mới nhất đang nằm trong hàng đợi để truyền vào prevCount.

  // Lesson 2:AUTOMATIC BATCHING & flushSync
  const handleRenderAutoBatching = () => {
    setTimeout(() => {
      setName("Bob");
      setAge(30);
    }, 1000)
  }

  const handleRenderWithFlushSync = () => {
    flushSync(() => { setName("Charlie"); });
    flushSync(() => { setAge(40); });
  }

  // TASK 3: BẪY MUTATION TRỰC TIẾP & CƠ CHẾ BAILOUT
  const [user, setUser] = React.useState({ name: "Senior", role: "Backend" });

  const handleMutableClick = () => {
    user.role = "Fullstack";
    setUser(user);
  }

  const handleImmutableClick = () => {
    setUser({ ...user, role: "Fullstack" });
  }

  // React áp dụng quy tắc cực kỳ đơn giản và nhanh gọn: So sánh địa chỉ ô nhớ (Reference Equality) bằng thuật toán Object.is(prevState, nextState).

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={handleClick}>Increase Count</button>
      <button onClick={handleClickWithDelay}>Increase Count with Delay</button>
      <button onClick={handleClickWithDelayFix}>Increase Count with Delay (Fixed)</button>
      <button onClick={handleRenderAutoBatching}>Render Batch</button>
      <button onClick={handleRenderWithFlushSync}>Render with flushSync</button>
      <p>User: {user.name} - Role: {user.role}</p>
      <button onClick={handleMutableClick}>Change Role (Mutable)</button>
      <button onClick={handleImmutableClick}>Change Role (Immutable)</button>
    </div>
  )
}