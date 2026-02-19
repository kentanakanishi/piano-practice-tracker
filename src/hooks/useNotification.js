import { useState, useEffect, useCallback } from 'react';
import { todayString } from '../utils/date';

const NOTIFICATION_KEY = 'notification-settings';

function loadSettings() {
  try {
    const raw = localStorage.getItem(NOTIFICATION_KEY);
    if (!raw) return { enabled: false, time: '21:00', lastNotifiedDate: null };
    return { enabled: false, time: '21:00', lastNotifiedDate: null, ...JSON.parse(raw) };
  } catch {
    return { enabled: false, time: '21:00', lastNotifiedDate: null };
  }
}

function saveSettings(settings) {
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(settings));
}

export function useNotification(data, mode) {
  const [settings, setSettings] = useState(loadSettings);

  const updateSettings = useCallback((updates) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      saveSettings(next);
      return next;
    });
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'unsupported';
    return await Notification.requestPermission();
  }, []);

  useEffect(() => {
    if (!settings.enabled) return;
    if (!('Notification' in window)) return;

    const check = () => {
      if (Notification.permission !== 'granted') return;

      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const today = todayString();

      if (currentTime !== settings.time) return;
      if (settings.lastNotifiedDate === today) return;
      if (data[today]) return;

      const title = mode === 'study' ? '学習の記録をしましょう！' : 'ピアノ練習の記録をしましょう！';
      new Notification(title, { body: '今日の記録がまだありません。' });

      updateSettings({ lastNotifiedDate: today });
    };

    const id = setInterval(check, 60000);
    check();

    return () => clearInterval(id);
  }, [settings.enabled, settings.time, settings.lastNotifiedDate, data, mode, updateSettings]);

  return { settings, updateSettings, requestPermission };
}
