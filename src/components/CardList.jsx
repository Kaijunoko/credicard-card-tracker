// export default function：將這個函式元件作為模組的預設匯出
// CardList 元件接收四個屬性（props）：
// - cards：包含所有信用卡資料的陣列
// - onEdit：當點擊編輯按鈕時要執行的函式
// - onDelete：當點擊刪除按鈕時要執行的函式
// - onSpendChange：當已消費金額輸入框內容改變時要執行的函式
import CardRow from './CardRow'; // 從同一個目錄中匯入 CardRow 元件

export default function CardList({ cards, onEdit, onDelete, onSpendChange }) {
  // 元件的回傳內容（JSX），用來渲染整個表格
  return (
    <table>
      {/* 表格標頭 */}
      <thead>
        <tr>
          <th>信用卡名稱</th>
          <th>可刷額度</th>
          <th>已刷金額</th>
          <th>剩餘可刷額度</th>
          <th>操作</th>
        </tr>
      </thead>
      
      {/* 表格主體 */}
      <tbody>
        {/*
          使用陣列的 .map() 方法，遍歷 'cards' 陣列中的每一張卡片。
          對於每一張卡片，都會渲染一個 <CardRow> 元件。
        */}
        {cards.map((card) => (
          // key={card.id}：這是 React 中渲染列表時非常重要的屬性，
          // 它可以幫助 React 識別列表中的每一項，並優化效能。
          // 'key' 必須是唯一的，通常使用資料的 ID。
          <CardRow
            key={card.id}
            card={card}
            onEdit={onEdit}
            onDelete={onDelete}
            onSpendChange={onSpendChange}
          />
        ))}
      </tbody>
    </table>
  );
}