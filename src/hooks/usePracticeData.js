import { useState, useCallback } from 'react';

const STORAGE_KEY = 'piano-practice-data';

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function usePracticeData() {
  const [data, setData] = useState(loadData);

  const addEntry = useCallback((dateStr, minutes) => {
    setData((prev) => {
      const next = { ...prev, [dateStr]: minutes };
      saveData(next);
      return next;
    });
  }, []);

  const removeEntry = useCallback((dateStr) => {
    setData((prev) => {
      const next = { ...prev };
      delete next[dateStr];
      saveData(next);
      return next;
    });
  }, []);

  return { data, addEntry, removeEntry };
}
