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
          <button className="btn-edit"
          onClick={() => {
            const newName = prompt('請輸入新的卡片名稱', card.name);
            if (newName) {
              onEdit(card.id, { name: newName });
    }
  }}
>
  ✏️</button>
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
import React, { useState } from 'react';
import CardRow from '../components/CardRow';
import ConfirmDialog from '../components/ConfirmDialog'; // ✅ 若要啟用確認對話框，記得引入元件

function Home({ cards, setCards }) {
  // 🆕 新卡片輸入狀態：用來暫存使用者在表單輸入的卡片資料
  const [newCard, setNewCard] = useState({
    name: '',
    cashbackLimit: '',
    cashbackPercent: '',
  });

  // 🧠 處理表單輸入變更：根據 input 的 name 屬性更新對應欄位
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard(prev => ({ ...prev, [name]: value }));
  };

  // 🧾 確認刪除對話框狀態管理
  const [showConfirm, setShowConfirm] = useState(false);         // 是否顯示確認對話框
  const [pendingDeleteId, setPendingDeleteId] = useState(null);  // 暫存欲刪除的卡片 ID

  // 🗑️ 點擊刪除按鈕：觸發確認對話框
  const handleDeleteClick = (id) => {
    setPendingDeleteId(id);
    setShowConfirm(true);
  };

  // ✅ 確認刪除：從 cards 陣列中移除指定卡片
  const confirmDelete = () => {
    setCards(prev => prev.filter(card => card.id !== pendingDeleteId));
    setShowConfirm(false);
  };

  // ❌ 取消刪除：關閉對話框，不做任何變更
  const cancelDelete = () => {
    setShowConfirm(false);
  };

  // ➕ 新增卡片：將表單資料加入 cards 陣列並清空表單
  const handleAddCard = () => {
    if (!newCard.name || !newCard.cashbackLimit || !newCard.cashbackPercent) return;

    const newId = `card-${Date.now()}`; // 以時間戳產生唯一 ID
    const card = {
      id: newId,
      name: newCard.name,
      cashbackLimit: Number(newCard.cashbackLimit),
      cashbackPercent: Number(newCard.cashbackPercent),
      spent: 0, // 初始已刷金額為 0
      history: [], // 初始化消費紀錄陣列
    };

    setCards(prev => [...prev, card]); // 加入新卡片
    setNewCard({ name: '', cashbackLimit: '', cashbackPercent: '' }); // 清空表單
  };

  // 💳 累加消費並記錄歷程：更新指定卡片的 spent 與 history 欄位
  const handleSpendChange = (id, newSpent, newHistory) => {
    setCards(prev =>
      prev.map(card =>
        card.id === id
          ? { ...card, spent: newSpent, history: newHistory }
          : card
      )
    );
  };

  // 🗑️ 直接刪除卡片（未使用確認對話框）
  const handleDelete = (id) => {
    setCards(prev => prev.filter(card => card.id !== id));
  };

  // ✏️ 編輯卡片資料：更新指定卡片的欄位（例如名稱、回饋比例等）
  const handleEdit = (id, updatedFields) => {
    setCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, ...updatedFields } : card
      )
    );
  };

  return (
    <div className="home-container">
      {/* 🆕 新增卡片表單區塊 */}
      <div className="form-title">新增卡片</div>
      <div className="form-row">
        <input
          type="text"
          name="name"
          placeholder="卡片名稱"
          value={newCard.name}
          onChange={handleInputChange}
          className="input-large"
        />
        <input
          type="number"
          name="cashbackLimit"
          placeholder="回饋上限（元）"
          value={newCard.cashbackLimit}
          onChange={handleInputChange}
          className="input-large"
        />
        <input
          type="number"
          name="cashbackPercent"
          placeholder="回饋比例（%）"
          value={newCard.cashbackPercent}
          onChange={handleInputChange}
          className="input-large"
        />
        <button className="btn" onClick={handleAddCard}>➕ 新增</button>
      </div>

      {/* 📋 卡片列表區塊 */}
      <table>
        <thead>
          <tr>
            <th>卡片名稱</th>
            <th>可刷金額</th>
            <th>已刷金額</th>
            <th>剩餘可刷</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {cards.map(card => (
            <CardRow
              key={card.id}
              card={card}
              onSpendChange={handleSpendChange}
              onDelete={handleDeleteClick}         // ✅ 若要使用確認對話框，改成 handleDeleteClick
              onEdit={handleEdit}
            />
          ))}
        </tbody>
      </table>

      {/* ✅ 確認刪除對話框（建議放在 return 最底部） */}
      { <ConfirmDialog
        message="你確定要刪除這張卡片嗎？"
        visible={showConfirm}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      /> }
    </div>
  );
}

