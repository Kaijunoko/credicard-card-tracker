import { useState, useEffect } from 'react';

export default function CardForm({ initialData, onSubmit, onCancel, mode }) {
  const [name, setName] = useState('');
  const [percent, setPercent] = useState('');
  const [limit, setLimit] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPercent(initialData.cashbackPercent);
      setLimit(initialData.cashbackLimit);
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSubmit({
      name,
      cashbackPercent: Number(percent),
      cashbackLimit: Number(limit),
    });
  };

  return (
    <div className="modal">
      <h2 className="form-title">{mode === 'edit' ? '編輯卡片' : '新增卡片'}</h2>

      <input
        className="input-large"
        placeholder="信用卡名稱"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="input-large"
        placeholder="回饋%"
        type="number"
        value={percent}
        onChange={(e) => setPercent(e.target.value)}
      />

      <input
        className="input-large"
        placeholder="回饋上限"
        type="number"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
      />

      <button className="btn" onClick={handleSubmit}>儲存</button>
      <button className="btn" onClick={onCancel}>取消</button>
    </div>
  );
}