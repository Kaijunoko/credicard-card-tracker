import { useState } from 'react';

// 📦 CardRow 元件：渲染單張信用卡的資料列與消費紀錄
// ✅ 接收四個 props：
// - card：卡片資料物件（包含 name, cashbackLimit, cashbackPercent, spent, history）
// - onSpendChange：已刷金額變更事件（支援累加與紀錄）
// - onDelete：刪除事件（刪除整張卡片）
// - onEdit：編輯事件（例如修改卡片名稱）

export default function CardRow({ card, onSpendChange, onDelete, onEdit }) {
  // 🆕 使用者輸入的新增消費金額（暫存）
  const [inputAmount, setInputAmount] = useState('');

  // ➕ 處理新增消費：累加金額並記錄時間
  const handleAddSpend = () => {
    const amount = Number(inputAmount); // 將輸入字串轉為數字
    if (!amount || amount <= 0) return; // 防呆：不可為空或負值

    const newSpent = card.spent + amount; // 累加已刷金額

    // 🧾 新增一筆消費紀錄（金額＋時間）
    const newHistory = [
      ...(card.history || []), // 保留原有紀錄
      { amount, time: new Date().toISOString() } // 新增一筆
    ];

    // 🔄 呼叫父層更新函式，傳入新金額與紀錄
    onSpendChange(card.id, newSpent, newHistory);

    // 🧹 清空輸入欄位
    setInputAmount('');
  };

  // 🧮 計算回饋上限前的最大可消費額（例如 500 元回饋上限 / 2%）
  const maxSpendable = card.cashbackLimit / (card.cashbackPercent / 100);

  // 🧮 計算剩餘可賺取回饋的消費額
  const remaining = maxSpendable - card.spent;

  return (
    <>
      {/* 📋 主資料列：顯示卡片資訊與新增消費欄位 */}
      <tr className="card-row">
        {/* 🏷️ 卡片名稱 */}
        <td className="card-name">{card.name}</td>

        {/* 💰 可刷金額（四捨五入到小數點後兩位） */}
        <td className="card-max">${maxSpendable.toFixed(2)}</td>

        {/* ➕ 新增消費欄位與按鈕 */}
        <td className="card-spent">
          <input
            type="number"
            className="used-amount-input"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="新增消費"
          />
          <button className="btn" onClick={handleAddSpend}>➕</button>

          {/* 💳 顯示目前已刷金額 */}
          <div>已刷：${card.spent.toFixed(2)}</div>
        </td>

        {/* 📉 剩餘可刷金額 */}
        <td className="card-remaining">${remaining.toFixed(2)}</td>

        {/* ✏️🗑️ 編輯與刪除按鈕 */}
        <td className="card-actions">
          <button className="btn-edit" onClick={() => onEdit(card.id)}>✏️</button>
          <button className="btn-delete" onClick={() => onDelete(card.id)}>🗑️</button>
        </td>
      </tr>

      {/* 🧾 消費紀錄列（可選）：顯示每筆消費金額與時間 */}
      {card.history?.length > 0 && (
        <tr>
          <td colSpan="5">
            <ul>
              {card.history.map((entry, index) => (
                <li key={index}>
                  ${entry.amount} - {new Date(entry.time).toLocaleString()}
                </li>
              ))}
            </ul>
          </td>
        </tr>
      )}
    </>
  );
}
