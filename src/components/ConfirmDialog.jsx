import React from 'react';
import './ConfirmDialog.css'; // 可選：分離樣式

export default function ConfirmDialog({ message, onConfirm, onCancel, visible }) {
  if (!visible) return null; // 如果未開啟，則不渲染

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="btn-confirm" onClick={onConfirm}>✅ 確認</button>
          <button className="btn-cancel" onClick={onCancel}>❌ 取消</button>
        </div>
      </div>
    </div>
  );
}
