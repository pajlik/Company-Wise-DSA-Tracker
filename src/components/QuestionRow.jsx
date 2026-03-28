import { useState } from "react";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Check,
  Clock,
  RotateCcw,
  Circle,
  FileText,
  Lightbulb,
  Timer,
  Database,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "unsolved",    label: "Unsolved",      icon: Circle,    color: "text-text-muted",    bg: "bg-surface-lighter" },
  { value: "in-progress", label: "In Progress",   icon: Clock,     color: "text-medium",        bg: "bg-medium/20" },
  { value: "solved",      label: "Solved",        icon: Check,     color: "text-easy",          bg: "bg-easy/20" },
  { value: "review",      label: "Needs Review",  icon: RotateCcw, color: "text-primary-light", bg: "bg-primary/20" },
];

const DIFFICULTY_COLORS = {
  Easy:   "text-easy bg-easy/10 border-easy/20",
  Medium: "text-medium bg-medium/10 border-medium/20",
  Hard:   "text-hard bg-hard/10 border-hard/20",
};

function DetailField({ icon: Icon, label, children }) {
  return (
    <div className="bg-surface rounded-xl border border-border/60 p-3 flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <Icon size={13} className="text-text-muted" />
        <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

export default function QuestionRow({ question, tracker, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const currentStatus = tracker?.status || "unsolved";

  return (
    <div className="border-b border-border/50 last:border-b-0">
      {/* Main row */}
      <div
        className={`grid grid-cols-[40px_1fr_100px_90px_90px_140px_44px] items-center gap-3 px-4 py-3
          hover:bg-surface-light/50 transition-colors ${currentStatus === "solved" ? "opacity-60" : ""}`}
      >
        {/* ID */}
        <span className="text-xs text-text-muted font-mono">{question.id}</span>

        {/* Title */}
        <div className="flex items-center gap-2 min-w-0">
          <a
            href={question.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text hover:text-primary-light transition-colors truncate font-medium"
          >
            {question.title}
          </a>
          <ExternalLink size={12} className="text-text-muted shrink-0" />
        </div>

        {/* Difficulty */}
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full border text-center ${
            DIFFICULTY_COLORS[question.difficulty] || "text-text-muted"
          }`}
        >
          {question.difficulty}
        </span>

        {/* Acceptance */}
        <span className="text-xs text-text-muted text-center">{question.acceptance}</span>

        {/* Frequency */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-surface-lighter rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: question.frequency }}
            />
          </div>
          <span className="text-[10px] text-text-muted w-10 text-right">{question.frequency}</span>
        </div>

        {/* Status toggle buttons */}
        <div className="flex items-center gap-1">
          {STATUS_OPTIONS.map(({ value, label, icon: Icon, color, bg }) => {
            const active = currentStatus === value;
            return (
              <button
                key={value}
                title={label}
                onClick={() => onUpdate({ ...tracker, status: value })}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  active ? `${bg} ${color}` : "text-text-muted/40 hover:text-text-muted hover:bg-surface-lighter"
                }`}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>

        {/* Expand */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 hover:bg-surface-lighter rounded-lg transition-colors cursor-pointer"
        >
          {expanded ? (
            <ChevronUp size={16} className="text-text-muted" />
          ) : (
            <ChevronDown size={16} className="text-text-muted" />
          )}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 bg-surface-light/20 border-t border-border/30">
          <div className="grid grid-cols-2 gap-3">
            <DetailField icon={FileText} label="Notes">
              <textarea
                value={tracker?.notes || ""}
                onChange={(e) => onUpdate({ ...tracker, notes: e.target.value })}
                placeholder="Add your notes..."
                rows={3}
                className="w-full text-sm bg-transparent text-text placeholder:text-text-muted/40
                  outline-none resize-none"
              />
            </DetailField>

            <DetailField icon={Lightbulb} label="Approach">
              <textarea
                value={tracker?.approach || ""}
                onChange={(e) => onUpdate({ ...tracker, approach: e.target.value })}
                placeholder="Describe your approach..."
                rows={3}
                className="w-full text-sm bg-transparent text-text placeholder:text-text-muted/40
                  outline-none resize-none"
              />
            </DetailField>

            <DetailField icon={Timer} label="Time Complexity">
              <input
                type="text"
                value={tracker?.timeComplexity || ""}
                onChange={(e) => onUpdate({ ...tracker, timeComplexity: e.target.value })}
                placeholder="e.g. O(n log n)"
                className="w-full text-sm bg-transparent text-text placeholder:text-text-muted/40 outline-none"
              />
            </DetailField>

            <DetailField icon={Database} label="Space Complexity">
              <input
                type="text"
                value={tracker?.spaceComplexity || ""}
                onChange={(e) => onUpdate({ ...tracker, spaceComplexity: e.target.value })}
                placeholder="e.g. O(n)"
                className="w-full text-sm bg-transparent text-text placeholder:text-text-muted/40 outline-none"
              />
            </DetailField>

            <DetailField icon={CalendarDays} label="Date Solved">
              <input
                type="date"
                value={tracker?.dateSolved || ""}
                onChange={(e) => onUpdate({ ...tracker, dateSolved: e.target.value })}
                className="w-full text-sm bg-transparent text-text outline-none [color-scheme:dark]"
              />
            </DetailField>

            <DetailField icon={RefreshCw} label="Revisions">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onUpdate({ ...tracker, revisions: Math.max(0, (tracker?.revisions || 0) - 1) })}
                  className="w-7 h-7 rounded-lg bg-surface-lighter border border-border text-text-muted
                    hover:text-text hover:border-primary/40 transition-colors text-sm font-bold cursor-pointer"
                >
                  −
                </button>
                <span className="text-lg font-bold text-text min-w-[24px] text-center">
                  {tracker?.revisions || 0}
                </span>
                <button
                  onClick={() => onUpdate({ ...tracker, revisions: (tracker?.revisions || 0) + 1 })}
                  className="w-7 h-7 rounded-lg bg-surface-lighter border border-border text-text-muted
                    hover:text-text hover:border-primary/40 transition-colors text-sm font-bold cursor-pointer"
                >
                  +
                </button>
                <span className="text-xs text-text-muted">times revised</span>
              </div>
            </DetailField>
          </div>
        </div>
      )}
    </div>
  );
}
