import './Stats.css';

export default function Stats({ data }) {
  const entries = Object.entries(data);
  const totalDays = entries.length;
  const totalMinutes = entries.reduce((sum, [, entry]) => sum + entry.minutes, 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return (
    <div className="card stats">
      <div className="stat-item">
        <span className="stat-value">{totalDays}</span>
        <span className="stat-label">練習日数</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">
          {hours > 0 && `${hours}時間`}{mins}分
        </span>
        <span className="stat-label">合計練習時間</span>
      </div>
      {totalDays > 0 && (
        <div className="stat-item">
          <span className="stat-value">{Math.round(totalMinutes / totalDays)}分</span>
          <span className="stat-label">平均練習時間</span>
        </div>
      )}
    </div>
  );
}
