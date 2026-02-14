import { MONTH_NAMES } from '../utils/date';
import './MonthNavigator.css';

export default function MonthNavigator({ year, month, onPrev, onNext }) {
  return (
    <div className="month-nav">
      <button className="nav-btn" onClick={onPrev}>←</button>
      <span className="nav-label">{year}年 {MONTH_NAMES[month]}</span>
      <button className="nav-btn" onClick={onNext}>→</button>
    </div>
  );
}
