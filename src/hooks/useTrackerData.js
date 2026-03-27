import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

const LS_KEY = "dsa-tracker-data";

function loadLS() {
  try {
    const item = localStorage.getItem(LS_KEY);
    return item ? JSON.parse(item) : {};
  } catch {
    return {};
  }
}

function saveLS(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {}
}

function deepMerge(base, override) {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (override[key] && typeof override[key] === "object" && !Array.isArray(override[key])) {
      result[key] = deepMerge(base[key] || {}, override[key]);
    } else {
      result[key] = override[key];
    }
  }
  return result;
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
  const [allData, setAllData] = useState(loadLS);
  const [syncing, setSyncing] = useState(false);
  const pendingUpserts = useRef({});
  const debounceTimer = useRef(null);

  // Load from Supabase when user logs in
  useEffect(() => {
    if (!user || !supabase) return;

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

        // DB is authoritative; localStorage fills in any locally-only data
        const lsData = loadLS();
        const merged = deepMerge(fromDB, lsData);
        setAllData(merged);
        saveLS(merged);

        // Push any localStorage-only entries up to Supabase
        const rows = [];
        for (const [company, questions] of Object.entries(lsData)) {
          for (const [questionId, entry] of Object.entries(questions)) {
            const dbEntry = fromDB[company]?.[questionId];
            if (!dbEntry) rows.push(toRow(user.id, company, questionId, entry));
          }
        }
        uploadBatch(rows);
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
        saveLS(next);
        return next;
      });
    },
    [user, flush]
  );

  return { allData, updateEntry, syncing };
}
