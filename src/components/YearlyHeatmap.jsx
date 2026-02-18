import { useState } from 'react';
import YearNavigator from './YearNavigator';
import { getWeeksInYear, MONTH_NAMES } from '../utils/date';
import { getHeatmapColor } from '../utils/color';
import './YearlyHeatmap.css';

const DAY_LABELS = ['', '月', '', '水', '', '金', ''];

export default function YearlyHeatmap({ data }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());

  const weeks = getWeeksInYear(year);

  // 月ラベルの位置を計算
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    for (const dateStr of week) {
      if (dateStr) {
        const m = parseInt(dateStr.slice(5, 7), 10) - 1;
        if (m !== lastMonth) {
          monthLabels.push({ month: m, weekIndex: wi });
          lastMonth = m;
        }
        break;
      }
    }
  });

  return (
    <div className="card">
      <YearNavigator
        year={year}
        onPrev={() => setYear(year - 1)}
        onNext={() => setYear(year + 1)}
      />
      <div className="heatmap-scroll">
        <div className="heatmap-container">
          {/* 月ラベル */}
          <div className="heatmap-month-labels" style={{ marginLeft: '30px' }}>
            {monthLabels.map(({ month, weekIndex }) => (
              <span
                key={`${month}-${weekIndex}`}
                className="heatmap-month-label"
                style={{ gridColumnStart: weekIndex + 1 }}
              >
                {MONTH_NAMES[month]}
              </span>
            ))}
          </div>

          <div className="heatmap-body">
            {/* 曜日ラベル */}
            <div className="heatmap-day-labels">
              {DAY_LABELS.map((label, i) => (
                <span key={i} className="heatmap-day-label">{label}</span>
              ))}
            </div>

            {/* ヒートマップグリッド */}
            <div className="heatmap-grid">
              {weeks.map((week, wi) => (
                <div key={wi} className="heatmap-week">
                  {week.map((dateStr, di) => {
                    if (!dateStr) {
                      return <div key={`${wi}-${di}`} className="heatmap-cell heatmap-cell--empty" />;
                    }
                    const entry = data[dateStr];
                    const minutes = entry?.minutes || 0;
                    const color = getHeatmapColor(minutes);
                    const commentSuffix = entry?.comment ? ` — ${entry.comment}` : '';
                    return (
                      <div
                        key={dateStr}
                        className="heatmap-cell"
                        style={{ backgroundColor: color }}
                        title={`${dateStr}: ${minutes > 0 ? `${minutes}分` : '練習なし'}${commentSuffix}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 凡例 */}
      <div className="heatmap-legend">
        <span className="heatmap-legend-label">少</span>
        <div className="heatmap-legend-cell" style={{ backgroundColor: 'var(--heat-0)' }} />
        <div className="heatmap-legend-cell" style={{ backgroundColor: 'var(--heat-1)' }} />
        <div className="heatmap-legend-cell" style={{ backgroundColor: 'var(--heat-2)' }} />
        <div className="heatmap-legend-cell" style={{ backgroundColor: 'var(--heat-3)' }} />
        <div className="heatmap-legend-cell" style={{ backgroundColor: 'var(--heat-4)' }} />
        <span className="heatmap-legend-label">多</span>
      </div>
    </div>
  );
}
