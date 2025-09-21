import React, { useState } from 'react';
import CardRow from '../components/CardRow';
// import ConfirmDialog from '../components/ConfirmDialog'; // ✅ 若要啟用確認對話框，記得引入元件

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
              onDelete={handleDelete}         // ✅ 若要使用確認對話框，改成 handleDeleteClick
              onEdit={handleEdit}
            />
          ))}
        </tbody>
      </table>

      {/* ✅ 確認刪除對話框（建議放在 return 最底部） */}
      {/* <ConfirmDialog
        message="你確定要刪除這張卡片嗎？"
        visible={showConfirm}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      /> */}
    </div>
  );
}

export default Home;
