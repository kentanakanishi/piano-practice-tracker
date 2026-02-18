import { useState } from 'react';
import MonthNavigator from './MonthNavigator';
import { getDaysInMonth, getFirstDayOfWeek, formatDate, DAY_LABELS } from '../utils/date';
import { getCalendarCellColor } from '../utils/color';
import './MonthlyCalendar.css';

export default function MonthlyCalendar({ data, onDateSelect }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  function handlePrev() {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  }

  function handleNext() {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  }

  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);

  const cells = [];
  // 先頭の空白セル
  for (let i = 0; i < firstDow; i++) {
    cells.push(null);
  }
  // 日付セル
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  return (
    <div className="card">
      <MonthNavigator year={year} month={month} onPrev={handlePrev} onNext={handleNext} />
      <div className="calendar-grid">
        {DAY_LABELS.map((label) => (
          <div key={label} className="calendar-dow">{label}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="calendar-cell calendar-cell--empty" />;
          }
          const dateStr = formatDate(year, month, day);
          const entry = data[dateStr];
          const minutes = entry?.minutes || 0;
          const bg = getCalendarCellColor(minutes);
          return (
            <div
              key={dateStr}
              className={`calendar-cell ${minutes > 0 ? 'calendar-cell--has-data' : ''}`}
              style={{ backgroundColor: bg }}
              onClick={() => onDateSelect(dateStr)}
            >
              <span className="calendar-day">{day}</span>
              {minutes > 0 && (
                <span className="calendar-minutes">{minutes}分</span>
              )}
              {entry?.comment && (
                <span className="calendar-comment-dot" title={entry.comment} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
