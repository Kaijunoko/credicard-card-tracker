import { useState, useEffect } from 'react';
import Home from './pages/Home';

function App() {
  // 📦 卡片資料狀態：包含卡片名稱、回饋上限、回饋比例、已刷金額
  const [cards, setCards] = useState([]);

  // 🔄 初始化：從 localStorage 讀取資料（若無則使用預設值）
  useEffect(() => {
    const saved = localStorage.getItem('cards');
    if (saved) {
      setCards(JSON.parse(saved)); // ✅ 讀取儲存的資料
    } else {
      // ✅ 預設卡片資料（可依需求修改或改成空陣列）
      setCards([
        { id: 'card1', name: '卡片A', cashbackLimit: 500, cashbackPercent: 2, spent: 0 },
        { id: 'card2', name: '卡片B', cashbackLimit: 300, cashbackPercent: 1.5, spent: 0 },
      ]);
    }
  }, []);

  // 💾 每次 cards 資料變動時，儲存到 localStorage
  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  // 🏠 傳入卡片資料與更新函式給 Home 頁面
  return <Home cards={cards} setCards={setCards} />;
}

export default App;