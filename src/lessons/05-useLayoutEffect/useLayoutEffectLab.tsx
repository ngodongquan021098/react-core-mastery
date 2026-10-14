import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

export const UseLayoutEffectLab = () => {
  const [show, setShow] = useState<boolean>(false);
  const [mode, setMode] = useState<'useEffect' | 'useLayoutEffect'>('useEffect');

  // Tọa độ top của Popup (mặc định là 0 ở đỉnh màn hình)
  const [popupTop, setPopupTop] = useState<number>(0);

  // Ref trỏ vào nút bấm để đo tọa độ DOM
  const buttonRef = useRef<HTMLButtonElement>(null);

  // =========================================================================
  // 👉 PHẦN DÀNH CHO BẠN TỰ CODE:
  // Viết logic đo đạc vị trí buttonRef và cập nhật popupTop
  // =========================================================================

  // Case 1: Dùng useEffect (Quan sát hiện tượng giật hình / Flicker)
  useEffect(() => {
    if (show && mode === 'useEffect') {
      // TODO: Đo tọa độ buttonRef.current và gán setPopupTop(...)
      const rect = buttonRef?.current?.getBoundingClientRect()
      setPopupTop((rect?.top || 0) + 10)
    }
  }, [show, mode]);

  // Case 2: Dùng useLayoutEffect(Quan sát độ mượt, không giật hình)
  useLayoutEffect(() => {
    if (show && mode === 'useLayoutEffect') {
      // TODO: Đo tọa độ buttonRef.current và gán setPopupTop(...)
      const rect = buttonRef?.current?.getBoundingClientRect()
      setPopupTop((rect?.top || 0) + 10)
    }
  }, [show, mode]);

  return (
    <div style={{ padding: '20px', minHeight: '100vh', position: 'relative' }}>
      <h2>Lesson 05: useLayoutEffect Lab</h2>
      <p style={{ color: '#64748b' }}>
        So sánh hiện tượng Flicker (giật hình) khi đo đạc DOM giữa useEffect và useLayoutEffect
      </p>

      {/* Bộ chọn Mode */}
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => { setShow(false); setMode('useEffect'); setPopupTop(0); }}
          style={{
            padding: '8px 16px',
            backgroundColor: mode === 'useEffect' ? '#ef4444' : '#334155',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Chế độ 1: Dùng useEffect (Dễ bị Flicker)
        </button>

        <button
          onClick={() => { setShow(false); setMode('useLayoutEffect'); setPopupTop(0); }}
          style={{
            padding: '8px 16px',
            backgroundColor: mode === 'useLayoutEffect' ? '#10b981' : '#334155',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Chế độ 2: Dùng useLayoutEffect (Mượt mà)
        </button>
      </div>

      <div style={{ marginTop: '10px' }}>
        Đang chọn: <strong>{mode}</strong>
      </div>

      {/* Nút bấm được đẩy xuống xa để thấy rõ khoảng cách từ top: 0 nhảy xuống */}
      <div style={{ marginTop: '250px' }}>
        <button
          ref={buttonRef}
          onClick={() => {
            setPopupTop(0); // Reset về 0 trước khi mở để kiểm tra có bị giật từ đỉnh xuống không
            setShow(prev => !prev);
          }}
          style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}
        >
          {show ? 'Đóng Popup' : 'Bấm để Hiện Popup'}
        </button>
      </div>

      {/* Hộp Popup hiển thị theo tọa độ popupTop */}
      {show && (
        <div
          style={{
            position: 'absolute',
            top: `${popupTop}px`,
            left: '20px',
            padding: '12px 20px',
            backgroundColor: mode === 'useEffect' ? '#fecaca' : '#bbf7d0',
            color: '#000',
            border: '2px solid',
            borderColor: mode === 'useEffect' ? '#ef4444' : '#16a34a',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'none' // Tắt CSS transition để thấy giật thật
          }}
        >
          🎯 Tôi là Popup! Tọa độ hiện tại: <strong>top: {popupTop}px</strong>
        </div>
      )}
    </div>
  );
};

