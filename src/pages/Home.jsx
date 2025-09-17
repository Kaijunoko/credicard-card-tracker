import React, { useState } from 'react';
import CardRow from '../components/CardRow';

function Home({ cards, setCards }) {
  // 🆕 新卡片輸入狀態
  const [newCard, setNewCard] = useState({
    name: '',
    cashbackLimit: '',
    cashbackPercent: '',
  });

  // 🧠 處理輸入變更
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard(prev => ({ ...prev, [name]: value }));
  };

  // ➕ 新增卡片
  const handleAddCard = () => {
    if (!newCard.name || !newCard.cashbackLimit || !newCard.cashbackPercent) return;

    const newId = `card-${Date.now()}`; // 以時間戳產生唯一 ID
    const card = {
      id: newId,
      name: newCard.name,
      cashbackLimit: Number(newCard.cashbackLimit),
      cashbackPercent: Number(newCard.cashbackPercent),
      spent: 0,
    };

    setCards(prev => [...prev, card]);
    setNewCard({ name: '', cashbackLimit: '', cashbackPercent: '' }); // 清空表單
  };

  // 🧾 已有的卡片列
  const handleSpendChange = (id, newValue) => {
    setCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, spent: Number(newValue) } : card
      )
    );
  };

  const handleDelete = (id) => {
    setCards(prev => prev.filter(card => card.id !== id));
  };

  const handleEdit = (id, updatedFields) => {
    setCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, ...updatedFields } : card
      )
    );
  };

  return (
    <div className="home-container">
      {/* 🆕 新增卡片表單 */}
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

      {/* 📋 卡片列表 */}
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
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Home;