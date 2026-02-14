/** 月の日数を返す */
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/** 月の1日の曜日を返す (0=日, 1=月, ..., 6=土) */
export function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

/** Date を "YYYY-MM-DD" 文字列に変換 */
export function formatDate(year, month, day) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

/** 今日の日付文字列を返す */
export function todayString() {
  const now = new Date();
  return formatDate(now.getFullYear(), now.getMonth(), now.getDate());
}

/** 年の最初の日の曜日を返す */
export function getFirstDayOfYear(year) {
  return new Date(year, 0, 1).getDay();
}

/** 閏年かどうか */
export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** 年の日数を返す */
export function getDaysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

/** 年間の全日付を週ごとにグループ化 (日曜始まり) */
export function getWeeksInYear(year) {
  const weeks = [];
  let currentWeek = [];

  const firstDay = new Date(year, 0, 1);
  const firstDow = firstDay.getDay();

  // 最初の週の先頭を null で埋める
  for (let i = 0; i < firstDow; i++) {
    currentWeek.push(null);
  }

  const totalDays = getDaysInYear(year);
  for (let d = 0; d < totalDays; d++) {
    const date = new Date(year, 0, 1 + d);
    const dateStr = formatDate(date.getFullYear(), date.getMonth(), date.getDate());
    currentWeek.push(dateStr);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // 最後の週の残りを null で埋める
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

/** 月名の配列 */
export const MONTH_NAMES = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月',
];

export const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];
