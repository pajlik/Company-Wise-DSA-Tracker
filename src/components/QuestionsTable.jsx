import { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import QuestionRow from "./QuestionRow";

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "unsolved", label: "Unsolved" },
  { value: "in-progress", label: "In Progress" },
  { value: "solved", label: "Solved" },
  { value: "review", label: "Needs Review" },
];

const DIFFICULTY_FILTERS = ["All", "Easy", "Medium", "Hard"];

export default function QuestionsTable({ questions, trackerData, onUpdateTracker }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  const filtered = useMemo(() => {
    let list = questions;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) || item.id.includes(q)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((item) => {
        const status = trackerData[item.id]?.status || "unsolved";
        return status === statusFilter;
      });
    }

    if (difficultyFilter !== "All") {
      list = list.filter((item) => item.difficulty === difficultyFilter);
    }

    list = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "id":
          cmp = parseInt(a.id) - parseInt(b.id);
          break;
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "difficulty": {
          const order = { Easy: 0, Medium: 1, Hard: 2 };
          cmp = (order[a.difficulty] ?? 3) - (order[b.difficulty] ?? 3);
          break;
        }
        case "acceptance":
          cmp = parseFloat(a.acceptance) - parseFloat(b.acceptance);
          break;
        case "frequency":
          cmp = parseFloat(a.frequency) - parseFloat(b.frequency);
          break;
        default:
          cmp = 0;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [questions, search, statusFilter, difficultyFilter, sortBy, sortDir, trackerData]);

  const toggleSort = (col) => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  const SortHeader = ({ col, children, className = "" }) => (
    <button
      onClick={() => toggleSort(col)}
      className={`flex items-center gap-1 text-[11px] uppercase tracking-wider text-text-muted font-semibold
        hover:text-text transition-colors cursor-pointer ${className}`}
    >
      {children}
      {sortBy === col && (
        <ArrowUpDown size={10} className="text-primary-light" />
      )}
    </button>
  );

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      {/* Filters bar */}
      <div className="px-4 py-3 border-b border-border flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-light rounded-lg flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="bg-transparent border-none outline-none text-sm text-text w-full placeholder:text-text-muted"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Filter size={14} className="text-text-muted" />
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer
                ${
                  statusFilter === f.value
                    ? "bg-primary/20 text-primary-light"
                    : "text-text-muted hover:text-text hover:bg-surface-lighter"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {DIFFICULTY_FILTERS.map((d) => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d)}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer
                ${
                  difficultyFilter === d
                    ? "bg-primary/20 text-primary-light"
                    : "text-text-muted hover:text-text hover:bg-surface-lighter"
                }`}
            >
              {d}
            </button>
          ))}
        </div>

        <span className="text-xs text-text-muted ml-auto">
          {filtered.length} of {questions.length} questions
        </span>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[40px_1fr_100px_90px_90px_130px_44px] items-center gap-3 px-4 py-2.5 bg-surface-light/50 border-b border-border">
        <SortHeader col="id">#</SortHeader>
        <SortHeader col="title">Title</SortHeader>
        <SortHeader col="difficulty" className="justify-center">Difficulty</SortHeader>
        <SortHeader col="acceptance" className="justify-center">Accept %</SortHeader>
        <SortHeader col="frequency">Frequency</SortHeader>
        <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
          Status
        </span>
        <span />
      </div>

      {/* Rows */}
      <div className="max-h-[calc(100vh-380px)] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-text-muted">
            <p className="text-lg mb-1">No questions found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          filtered.map((q) => (
            <QuestionRow
              key={q.id}
              question={q}
              tracker={trackerData[q.id]}
              onUpdate={(data) => onUpdateTracker(q.id, data)}
            />
          ))
        )}
      </div>
    </div>
  );
}
