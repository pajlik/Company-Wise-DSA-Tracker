import { useState, useEffect } from "react";
import Papa from "papaparse";
import { CSV_BASE_URL } from "../constants/companies";

export function useCsvData(company, timePeriod) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!company) {
      setQuestions([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const url = `${CSV_BASE_URL}/${company}/${timePeriod}.csv`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.text();
      })
      .then((csvText) => {
        if (cancelled) return;
        const result = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
        });
        setQuestions(
          result.data.map((row) => ({
            id: row["ID"],
            url: row["URL"],
            title: row["Title"],
            difficulty: row["Difficulty"],
            acceptance: row["Acceptance %"],
            frequency: row["Frequency %"],
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setQuestions([]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [company, timePeriod]);

  return { questions, loading, error };
}
