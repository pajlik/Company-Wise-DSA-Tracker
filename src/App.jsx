import { useState, useCallback } from "react";
import { Code2, ExternalLink } from "lucide-react";
import CompanySelector from "./components/CompanySelector";
import TimePeriodSelector from "./components/TimePeriodSelector";
import QuestionsTable from "./components/QuestionsTable";
import StatsBar from "./components/StatsBar";
import { useCsvData } from "./hooks/useCsvData";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { formatCompanyName } from "./constants/companies";

function App() {
  const [company, setCompany] = useState("");
  const [timePeriod, setTimePeriod] = useState("all");
  const { questions, loading, error } = useCsvData(company, timePeriod);

  // trackerData shape: { [company]: { [questionId]: { status, notes, approach, timeComplexity, spaceComplexity, dateSolved, revisions } } }
  const [allTrackerData, setAllTrackerData] = useLocalStorage("dsa-tracker-data", {});

  const trackerData = allTrackerData[company] || {};

  const handleUpdateTracker = useCallback(
    (questionId, data) => {
      setAllTrackerData((prev) => ({
        ...prev,
        [company]: {
          ...(prev[company] || {}),
          [questionId]: {
            ...(prev[company]?.[questionId] || {}),
            ...data,
          },
        },
      }));
    },
    [company, setAllTrackerData]
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
              <Code2 size={20} className="text-primary-light" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text leading-tight">DSA Tracker</h1>
              <p className="text-xs text-text-muted">Company-wise LeetCode Questions</p>
            </div>
          </div>
          <a
            href="https://github.com/snehasishroy/leetcode-companywise-interview-questions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
          >
            <ExternalLink size={18} />
            <span className="hidden sm:inline">Source</span>
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <CompanySelector selected={company} onSelect={setCompany} />
          {company && <TimePeriodSelector selected={timePeriod} onSelect={setTimePeriod} />}
        </div>

        {/* Content */}
        {!company && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Code2 size={40} className="text-primary-light" />
            </div>
            <h2 className="text-2xl font-bold text-text mb-2">Select a Company</h2>
            <p className="text-text-muted max-w-md">
              Choose a company from the dropdown above to view and track their most frequently asked
              LeetCode interview questions.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-text-muted">
                Loading {formatCompanyName(company)} questions...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-hard/10 border border-hard/20 rounded-xl px-6 py-4 text-center">
            <p className="text-hard text-sm">Failed to load questions: {error}</p>
            <p className="text-text-muted text-xs mt-1">
              The CSV file might not be available for this company/time period.
            </p>
          </div>
        )}

        {company && !loading && !error && questions.length > 0 && (
          <>
            <StatsBar questions={questions} trackerData={trackerData} />
            <QuestionsTable
              questions={questions}
              trackerData={trackerData}
              onUpdateTracker={handleUpdateTracker}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
