/**
 * 練習分数に応じたヒートマップの色を返す
 * 0分=灰, <15分=薄緑, <30分=緑, <60分=濃緑, 60分+=深緑
 */
export function getHeatmapColor(minutes) {
  if (!minutes || minutes <= 0) return 'var(--heat-0)';
  if (minutes < 15) return 'var(--heat-1)';
  if (minutes < 30) return 'var(--heat-2)';
  if (minutes < 60) return 'var(--heat-3)';
  return 'var(--heat-4)';
}

/**
 * 練習分数に応じたカレンダーセルの背景色を返す
 */
export function getCalendarCellColor(minutes) {
  if (!minutes || minutes <= 0) return 'transparent';
  if (minutes < 15) return 'var(--heat-1)';
  if (minutes < 30) return 'var(--heat-2)';
  if (minutes < 60) return 'var(--heat-3)';
  return 'var(--heat-4)';
}
