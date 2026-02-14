import './YearNavigator.css';

export default function YearNavigator({ year, onPrev, onNext }) {
  return (
    <div className="year-nav">
      <button className="nav-btn" onClick={onPrev}>←</button>
      <span className="nav-label">{year}年</span>
      <button className="nav-btn" onClick={onNext}>→</button>
    </div>
  );
}
