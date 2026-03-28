import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

const ANON_LS_KEY = "dsa-tracker-data";

function lsKey(userId) {
  return userId ? `dsa-tracker-data-${userId}` : ANON_LS_KEY;
}

function loadLS(userId) {
  try {
    const item = localStorage.getItem(lsKey(userId));
    return item ? JSON.parse(item) : {};
  } catch {
    return {};
  }
}

function saveLS(userId, data) {
  try {
    localStorage.setItem(lsKey(userId), JSON.stringify(data));
  } catch {}
}

function toRow(userId, company, questionId, entry) {
  return {
    user_id: userId,
    company,
    question_id: questionId,
    status: entry.status ?? null,
    notes: entry.notes ?? null,
    approach: entry.approach ?? null,
    time_complexity: entry.timeComplexity ?? null,
    space_complexity: entry.spaceComplexity ?? null,
    date_solved: entry.dateSolved ?? null,
    revisions: entry.revisions ?? 0,
    updated_at: new Date().toISOString(),
  };
}

async function uploadBatch(rows) {
  if (!supabase || rows.length === 0) return;
  for (let i = 0; i < rows.length; i += 500) {
    await supabase
      .from("question_tracker")
      .upsert(rows.slice(i, i + 500), { onConflict: "user_id,company,question_id" });
  }
}

export function useTrackerData(user) {
  const [allData, setAllData] = useState(() => loadLS(null));
  const [syncing, setSyncing] = useState(false);
  const pendingUpserts = useRef({});
  const debounceTimer = useRef(null);

  useEffect(() => {
    // User logged out — reset to anonymous localStorage
    if (!user) {
      setAllData(loadLS(null));
      return;
    }

    // User logged in — load only their data from Supabase
    if (!supabase) {
      setAllData(loadLS(user.id));
      return;
    }

    setSyncing(true);
    supabase
      .from("question_tracker")
      .select("*")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        setSyncing(false);
        if (error || !data) return;

        // Convert flat rows → nested structure
        const fromDB = {};
        for (const row of data) {
          if (!fromDB[row.company]) fromDB[row.company] = {};
          fromDB[row.company][row.question_id] = {
            status: row.status,
            notes: row.notes,
            approach: row.approach,
            timeComplexity: row.time_complexity,
            spaceComplexity: row.space_complexity,
            dateSolved: row.date_solved,
            revisions: row.revisions,
          };
        }

        // Use DB data as source of truth for this user
        setAllData(fromDB);
        saveLS(user.id, fromDB);
      });
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const flush = useCallback(async () => {
    const rows = Object.values(pendingUpserts.current);
    pendingUpserts.current = {};
    await uploadBatch(rows);
  }, []);

  const updateEntry = useCallback(
    (company, questionId, data) => {
      setAllData((prev) => {
        const merged = { ...(prev[company]?.[questionId] || {}), ...data };

        if (user && supabase) {
          const key = `${company}::${questionId}`;
          pendingUpserts.current[key] = toRow(user.id, company, questionId, merged);
          clearTimeout(debounceTimer.current);
          debounceTimer.current = setTimeout(flush, 800);
        }

        const next = {
          ...prev,
          [company]: { ...(prev[company] || {}), [questionId]: merged },
        };
        saveLS(user?.id ?? null, next);
        return next;
      });
    },
    [user, flush]
  );

  return { allData, updateEntry, syncing };
}
