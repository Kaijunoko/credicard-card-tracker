// 📦 CardRow 元件：渲染單張信用卡的資料列
// ✅ 接收四個 props：
// - card：卡片資料物件（包含 name, cashbackLimit, cashbackPercent, spent）
// - onEdit：編輯事件（例如修改卡片名稱）
// - onDelete：刪除事件
// - onSpendChange：已刷金額變更事件

export default function CardRow({ card, onEdit, onDelete, onSpendChange }) {
  // 🧮 計算回饋上限前的最大可消費額
  const maxSpendable = card.cashbackLimit / (card.cashbackPercent / 100);

  // 🧮 計算剩餘可賺取回饋的消費額
  const remaining = maxSpendable - card.spent;

  return (
    <tr className="card-row">
      {/* 🏷️ 卡片名稱 */}
      <td className="card-name">{card.name}</td>

      {/* 💰 可刷金額（四捨五入到小數點後兩位） */}
      <td className="card-max">${maxSpendable.toFixed(2)}</td>

      {/* 🧾 已刷金額輸入框 */}
      <td className="card-spent">
        <input
          className="used-amount-input"
          type="number"
          value={card.spent}
          onChange={(e) => onSpendChange(card.id, e.target.value)}
        />
      </td>

      {/* 📉 剩餘可刷金額 */}
      <td className="card-remaining">${remaining.toFixed(2)}</td>

      {/* ✏️🗑️ 編輯與刪除按鈕 */}
      <td className="card-actions">
        <button className="btn-edit" onClick={() => onEdit(card.id)}>✏️</button>
        <button className="btn-delete" onClick={() => onDelete(card.id)}>🗑️</button>
      </td>
    </tr>
  );
}