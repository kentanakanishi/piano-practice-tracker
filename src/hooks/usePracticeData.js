import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const LEGACY_STORAGE_KEY = 'piano-practice-data';
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function storageKey(mode) {
  return `practice-data-${mode}`;
}

function migrationDoneKey(mode) {
  return `practice-migrated-${mode}`;
}

// --- localStorage helpers ---

function parsePracticeData(raw) {
  const parsed = JSON.parse(raw);
  const result = {};
  for (const [date, val] of Object.entries(parsed)) {
    if (typeof val === 'number') {
      result[date] = { minutes: val, comment: '' };
    } else {
      result[date] = val;
    }
  }
  return result;
}

function loadLocalData(mode) {
  try {
    const key = storageKey(mode);
    const raw = localStorage.getItem(key);

    // pianoモードのみ旧キーからの自動移行
    if (!raw && mode === 'piano') {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        const legacyData = parsePracticeData(legacyRaw);
        localStorage.setItem(key, JSON.stringify(legacyData));
        return legacyData;
      }
    }

    if (!raw) return {};
    return parsePracticeData(raw);
  } catch {
    return {};
  }
}

function saveLocalData(data, mode) {
  localStorage.setItem(storageKey(mode), JSON.stringify(data));
}

// --- Supabase helpers ---

async function fetchSupabaseData(userId, mode) {
  const { data, error } = await supabase
    .from('practice_entries')
    .select('practice_date, minutes, comment')
    .eq('user_id', userId)
    .eq('tracker_type', mode);

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

async function upsertSupabaseEntry(userId, dateStr, minutes, comment, mode) {
  const { error } = await supabase
    .from('practice_entries')
    .upsert(
      { user_id: userId, practice_date: dateStr, minutes, comment: comment || '', tracker_type: mode },
      { onConflict: 'user_id,practice_date,tracker_type' }
    );

  if (error && import.meta.env.DEV) console.error('Failed to save entry:', error.message);
}

async function deleteSupabaseEntry(userId, dateStr, mode) {
  const { error } = await supabase
    .from('practice_entries')
    .delete()
    .eq('user_id', userId)
    .eq('practice_date', dateStr)
    .eq('tracker_type', mode);

  if (error && import.meta.env.DEV) console.error('Failed to delete entry:', error.message);
}

async function migrateLocalDataToSupabase(userId, mode, localData) {
  const entries = Object.entries(localData);
  if (entries.length === 0) return;

  const rows = entries.map(([dateStr, entry]) => ({
    user_id: userId,
    practice_date: dateStr,
    minutes: entry.minutes,
    comment: entry.comment || '',
    tracker_type: mode,
  }));

  const { error } = await supabase
    .from('practice_entries')
    .upsert(rows, { onConflict: 'user_id,practice_date,tracker_type' });

  if (error) {
    if (import.meta.env.DEV) console.error('Migration failed:', error.message);
    return;
  }

  localStorage.setItem(migrationDoneKey(mode), 'true');
}

// --- Hook ---

export function usePracticeData(mode) {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState(() => loadLocalData(mode));
  const [loading, setLoading] = useState(false);
  const userIdRef = useRef(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      userIdRef.current = null;
      setData(loadLocalData(mode));
      return;
    }

    userIdRef.current = user.id;
    let cancelled = false;

    (async () => {
      setLoading(true);

      const migrated = localStorage.getItem(migrationDoneKey(mode));
      const localData = loadLocalData(mode);
      if (!migrated && Object.keys(localData).length > 0) {
        await migrateLocalDataToSupabase(user.id, mode, localData);
      }

      const supabaseData = await fetchSupabaseData(user.id, mode);

      if (!cancelled) {
        setData(supabaseData);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user, authLoading, mode]);

  const addEntry = useCallback((dateStr, minutes, comment = '') => {
    if (!DATE_REGEX.test(dateStr)) return;
    setData((prev) => {
      const next = { ...prev, [dateStr]: { minutes, comment } };

      if (userIdRef.current) {
        upsertSupabaseEntry(userIdRef.current, dateStr, minutes, comment, mode);
      } else {
        saveLocalData(next, mode);
      }

      return next;
    });
  }, [mode]);

  const removeEntry = useCallback((dateStr) => {
    if (!DATE_REGEX.test(dateStr)) return;
    setData((prev) => {
      const next = { ...prev };
      delete next[dateStr];

      if (userIdRef.current) {
        deleteSupabaseEntry(userIdRef.current, dateStr, mode);
      } else {
        saveLocalData(next, mode);
      }

      return next;
    });
  }, [mode]);

  return { data, addEntry, removeEntry, loading };
}
