// 從自訂的 Hook 匯入所有信用卡管理功能
import { useCardManager } from '../hooks/useCardManager';
// 匯入 CardForm 元件，用於新增或編輯卡片
import CardForm from '../components/CardForm';
// 匯入 CardList 元件，用於顯示卡片列表
import CardList from '../components/CardList';
// 從 React 匯入 useState，用於管理元件的內部狀態
import { useState } from 'react';

// Home 元件是整個應用程式的主頁面
export default function Home() {
  // 呼叫 useCardManager Hook，取得管理信用卡所需的所有狀態和函式
  const { cards, addCard, updateCard, deleteCard, updateSpent } = useCardManager();

  // 宣告 showForm 狀態，控制 CardForm 表單的顯示與隱藏
  const [showForm, setShowForm] = useState(false);
  // 宣告 editId 狀態，儲存正在編輯的卡片 ID；如果為 null，表示是新增模式
  const [editId, setEditId] = useState(null);

  // 處理表單提交的函式
  const handleSubmit = (data) => {
    // 判斷 editId 是否存在，以決定是更新還是新增
    if (editId) {
      updateCard(editId, data); // 如果有 ID，執行更新卡片的函式
    } else {
      addCard(data); // 如果沒有 ID，執行新增卡片的函式
    }
    setShowForm(false); // 提交後，隱藏表單
    setEditId(null); // 重設 editId 狀態
  };

  // 處理編輯按鈕點擊的函式
  const handleEdit = (id) => {
    setEditId(id); // 設定要編輯的卡片 ID
    setShowForm(true); // 顯示表單
  };

  // 處理取消按鈕點擊的函式
  const handleCancel = () => {
    setShowForm(false); // 隱藏表單
    setEditId(null); // 重設 editId 狀態
  };

  // 根據 editId 找到當前正在編輯的卡片資料
  const currentEditCard = cards.find((c) => c.id === editId);

  // 元件的回傳內容（JSX），用來渲染整個頁面
  return (
    <div className="p-4">
      <h1>信用卡記帳系統</h1>
      {/* 新增卡片按鈕，點擊時顯示表單 */}
      <button onClick={() => setShowForm(true)}>➕ 新增卡片</button>
      
      {/* 顯示信用卡列表 */}
      <CardList
        cards={cards} // 傳遞卡片資料
        onEdit={handleEdit} // 傳遞編輯函式
        onDelete={deleteCard} // 傳遞刪除函式
        onSpendChange={updateSpent} // 傳遞更新消費金額函式
      />
      
      {/* 條件渲染：只有在 showForm 為 true 時才顯示 CardForm */}
      {showForm && (
        <CardForm
          initialData={currentEditCard} // 傳遞初始資料，用於編輯模式
          onSubmit={handleSubmit} // 傳遞提交函式
          onCancel={handleCancel} // 傳遞取消函式
          // 根據 editId 動態設定模式，決定表單標題
          mode={editId ? 'edit' : 'create'}
        />
      )}
    </div>
  );
}