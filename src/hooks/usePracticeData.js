import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'piano-practice-data';
const MIGRATION_DONE_KEY = 'piano-practice-migrated';
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// --- localStorage helpers ---

function loadLocalData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // 旧形式 { date: number } を新形式 { date: { minutes, comment } } に変換
    const result = {};
    for (const [date, val] of Object.entries(parsed)) {
      if (typeof val === 'number') {
        result[date] = { minutes: val, comment: '' };
      } else {
        result[date] = val;
      }
    }
    return result;
  } catch {
    return {};
  }
}

function saveLocalData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// --- Supabase helpers ---

async function fetchSupabaseData(userId) {
  const { data, error } = await supabase
    .from('practice_entries')
    .select('practice_date, minutes, comment')
    .eq('user_id', userId);

  if (error) {
    if (import.meta.env.DEV) console.error('Failed to fetch practice data:', error.message);
    return {};
  }

  const result = {};
  for (const row of data) {
    result[row.practice_date] = { minutes: row.minutes, comment: row.comment || '' };
  }
  return result;
}

async function upsertSupabaseEntry(userId, dateStr, minutes, comment) {
  const { error } = await supabase
    .from('practice_entries')
    .upsert(
      { user_id: userId, practice_date: dateStr, minutes, comment: comment || '' },
      { onConflict: 'user_id,practice_date' }
    );

  if (error && import.meta.env.DEV) console.error('Failed to save entry:', error.message);
}

async function deleteSupabaseEntry(userId, dateStr) {
  const { error } = await supabase
    .from('practice_entries')
    .delete()
    .eq('user_id', userId)
    .eq('practice_date', dateStr);

  if (error && import.meta.env.DEV) console.error('Failed to delete entry:', error.message);
}

async function migrateLocalDataToSupabase(userId) {
  const localData = loadLocalData();
  const entries = Object.entries(localData);
  if (entries.length === 0) return;

  const rows = entries.map(([dateStr, entry]) => ({
    user_id: userId,
    practice_date: dateStr,
    minutes: entry.minutes,
    comment: entry.comment || '',
  }));

  const { error } = await supabase
    .from('practice_entries')
    .upsert(rows, { onConflict: 'user_id,practice_date' });

  if (error) {
    if (import.meta.env.DEV) console.error('Migration failed:', error.message);
    return;
  }

  localStorage.setItem(MIGRATION_DONE_KEY, 'true');
}

// --- Hook ---

export function usePracticeData() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState(loadLocalData);
  const [loading, setLoading] = useState(false);
  const userIdRef = useRef(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      userIdRef.current = null;
      setData(loadLocalData());
      return;
    }

    userIdRef.current = user.id;
    let cancelled = false;

    (async () => {
      setLoading(true);

      const migrated = localStorage.getItem(MIGRATION_DONE_KEY);
      const localData = loadLocalData();
      if (!migrated && Object.keys(localData).length > 0) {
        await migrateLocalDataToSupabase(user.id);
      }

      const supabaseData = await fetchSupabaseData(user.id);

      if (!cancelled) {
        setData(supabaseData);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user, authLoading]);

  const addEntry = useCallback((dateStr, minutes, comment = '') => {
    if (!DATE_REGEX.test(dateStr)) return;
    setData((prev) => {
      const next = { ...prev, [dateStr]: { minutes, comment } };

      if (userIdRef.current) {
        upsertSupabaseEntry(userIdRef.current, dateStr, minutes, comment);
      } else {
        saveLocalData(next);
      }

      return next;
    });
  }, []);

  const removeEntry = useCallback((dateStr) => {
    if (!DATE_REGEX.test(dateStr)) return;
    setData((prev) => {
      const next = { ...prev };
      delete next[dateStr];

      if (userIdRef.current) {
        deleteSupabaseEntry(userIdRef.current, dateStr);
      } else {
        saveLocalData(next);
      }

      return next;
    });
  }, []);

  return { data, addEntry, removeEntry, loading };
}
