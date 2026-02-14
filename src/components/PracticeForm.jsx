import { useState, useEffect } from 'react';
import { todayString } from '../utils/date';
import './PracticeForm.css';

export default function PracticeForm({ data, selectedDate, onAdd, onRemove }) {
  const [date, setDate] = useState(selectedDate || todayString());
  const [minutes, setMinutes] = useState('');

  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
      setMinutes(data[selectedDate] ? String(data[selectedDate]) : '');
    }
  }, [selectedDate, data]);

  function handleSubmit(e) {
    e.preventDefault();
    const min = parseInt(minutes, 10);
    if (!date || isNaN(min) || min < 1 || min > 480) return;
    onAdd(date, min);
    setMinutes('');
  }

  function handleDelete() {
    if (date && data[date]) {
      onRemove(date);
      setMinutes('');
    }
  }

  return (
    <form className="card practice-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label className="form-field">
          <span className="form-label">日付</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
          />
        </label>
        <label className="form-field">
          <span className="form-label">練習時間（分）</span>
          <input
            type="number"
            min="1"
            max="480"
            placeholder="30"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="form-input"
          />
        </label>
        <button type="submit" className="btn btn-primary">
          保存
        </button>
        {date && data[date] && (
          <button type="button" className="btn btn-danger" onClick={handleDelete}>
            削除
          </button>
        )}
      </div>
    </form>
  );
}
