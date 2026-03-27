import { useState, useCallback, useEffect } from "react";
import { Code2, ExternalLink, LogIn, LogOut, Loader2 } from "lucide-react";
import CompanySelector from "./components/CompanySelector";
import TimePeriodSelector from "./components/TimePeriodSelector";
import QuestionsTable from "./components/QuestionsTable";
import StatsBar from "./components/StatsBar";
import AuthModal from "./components/AuthModal";
import { useCsvData } from "./hooks/useCsvData";
import { useTrackerData } from "./hooks/useTrackerData";
import { formatCompanyName } from "./constants/companies";
import { supabase } from "./lib/supabase";

function App() {
  const [company, setCompany] = useState("");
  const [timePeriod, setTimePeriod] = useState("all");
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  const { questions, loading, error } = useCsvData(company, timePeriod);
  const { allData: allTrackerData, updateEntry, syncing } = useTrackerData(user);

  const trackerData = allTrackerData[company] || {};

  // Auth state listener
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleUpdateTracker = useCallback(
    (questionId, data) => {
      updateEntry(company, questionId, data);
    },
    [company, updateEntry]
  );

  async function handleSignOut() {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  }

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

          <div className="flex items-center gap-3">
            {/* Sync indicator */}
            {syncing && (
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Loader2 size={13} className="animate-spin" />
                <span className="hidden sm:inline">Syncing…</span>
              </div>
            )}

            <a
              href="https://github.com/snehasishroy/leetcode-companywise-interview-questions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
            >
              <ExternalLink size={18} />
              <span className="hidden sm:inline">Source</span>
            </a>

            {/* Auth button */}
            {supabase && (
              user ? (
                <div className="flex items-center gap-2">
                  <span className="hidden sm:block text-xs text-text-muted truncate max-w-[140px]">
                    {user.email || user.user_metadata?.full_name}
                  </span>
                  <button
                    onClick={handleSignOut}
                    title="Sign out"
                    className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text
                      px-2.5 py-1.5 rounded-lg hover:bg-surface-light border border-transparent
                      hover:border-border transition-colors cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span className="hidden sm:inline">Sign out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="flex items-center gap-1.5 text-xs text-primary-light
                    px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20
                    hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  <LogIn size={15} />
                  Sign in to sync
                </button>
              )
            )}
          </div>
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

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-1.5 text-sm text-text-muted">
          <span>Maintained by</span>
          <a
            href="https://www.linkedin.com/in/prajwal-gupta"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-primary-light hover:underline font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Prajwal Gupta
          </a>
        </div>
      </footer>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  );
}

export default App;
