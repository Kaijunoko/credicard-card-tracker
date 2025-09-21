import { useState } from 'react';

// 📦 CardRow 元件：渲染單張信用卡的資料列與消費紀錄
export default function CardRow({ card, onSpendChange, onDelete, onEdit }) {
  const [inputAmount, setInputAmount] = useState('');

  // ➕ 新增消費並記錄
  const handleAddSpend = () => {
    const amount = Number(inputAmount);
    if (!amount || amount <= 0) return;

    const newSpent = card.spent + amount;
    const newHistory = [
      ...(card.history || []),
      { amount, time: new Date().toISOString() }
    ];

    onSpendChange(card.id, newSpent, newHistory);
    setInputAmount('');
  };

  const maxSpendable = card.cashbackLimit / (card.cashbackPercent / 100);
  const remaining = maxSpendable - card.spent;

  return (
    <>
      <tr className="card-row">
        <td className="card-name">{card.name}</td>
        <td className="card-max">${maxSpendable.toFixed(2)}</td>
        <td className="card-spent">
          <input
            type="number"
            className="used-amount-input"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="新增消費"
          />
          <button className="btn" onClick={handleAddSpend}>➕</button>
          <div>已刷：${card.spent.toFixed(2)}</div>
        </td>
        <td className="card-remaining">${remaining.toFixed(2)}</td>
        <td className="card-actions">
          <button
            className="btn-edit"
            onClick={() => {
              const newName = prompt('請輸入新的卡片名稱', card.name);
              if (newName) {
                onEdit(card.id, { name: newName });
              }
            }}
          >
            ✏️
          </button>
          <button className="btn-delete" onClick={() => onDelete(card.id)}>🗑️</button>
        </td>
      </tr>

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
