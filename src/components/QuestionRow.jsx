import { useState } from "react";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Check,
  Clock,
  RotateCcw,
  Circle,
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "unsolved", label: "Unsolved", icon: Circle, color: "text-text-muted" },
  { value: "in-progress", label: "In Progress", icon: Clock, color: "text-medium" },
  { value: "solved", label: "Solved", icon: Check, color: "text-easy" },
  { value: "review", label: "Needs Review", icon: RotateCcw, color: "text-primary-light" },
];

const DIFFICULTY_COLORS = {
  Easy: "text-easy bg-easy/10 border-easy/20",
  Medium: "text-medium bg-medium/10 border-medium/20",
  Hard: "text-hard bg-hard/10 border-hard/20",
};

export default function QuestionRow({ question, tracker, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_OPTIONS.find((s) => s.value === (tracker?.status || "unsolved"));
  const StatusIcon = status.icon;

  return (
    <div className="border-b border-border/50 last:border-b-0">
      {/* Main row */}
      <div
        className={`grid grid-cols-[40px_1fr_100px_90px_90px_130px_44px] items-center gap-3 px-4 py-3
          hover:bg-surface-light/50 transition-colors ${tracker?.status === "solved" ? "opacity-70" : ""}`}
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

        {/* Status */}
        <select
          value={tracker?.status || "unsolved"}
          onChange={(e) => onUpdate({ ...tracker, status: e.target.value })}
          className={`text-xs px-2 py-1.5 rounded-lg bg-surface-light border border-border cursor-pointer
            outline-none ${status.color}`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

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
        <div className="px-6 pb-4 pt-1 bg-surface-light/30 border-t border-border/30">
          <div className="grid grid-cols-2 gap-4">
            {/* Notes */}
            <div>
              <label className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-1.5 block">
                Notes
              </label>
              <textarea
                value={tracker?.notes || ""}
                onChange={(e) => onUpdate({ ...tracker, notes: e.target.value })}
                placeholder="Add your notes..."
                rows={3}
                className="w-full text-sm bg-surface border border-border rounded-lg px-3 py-2
                  text-text placeholder:text-text-muted/50 outline-none focus:border-primary/50
                  resize-none"
              />
            </div>

            {/* Approach */}
            <div>
              <label className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-1.5 block">
                Approach
              </label>
              <textarea
                value={tracker?.approach || ""}
                onChange={(e) => onUpdate({ ...tracker, approach: e.target.value })}
                placeholder="Describe your approach..."
                rows={3}
                className="w-full text-sm bg-surface border border-border rounded-lg px-3 py-2
                  text-text placeholder:text-text-muted/50 outline-none focus:border-primary/50
                  resize-none"
              />
            </div>

            {/* Time Complexity */}
            <div>
              <label className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-1.5 block">
                Time Complexity
              </label>
              <input
                type="text"
                value={tracker?.timeComplexity || ""}
                onChange={(e) => onUpdate({ ...tracker, timeComplexity: e.target.value })}
                placeholder="e.g., O(n log n)"
                className="w-full text-sm bg-surface border border-border rounded-lg px-3 py-2
                  text-text placeholder:text-text-muted/50 outline-none focus:border-primary/50"
              />
            </div>

            {/* Space Complexity */}
            <div>
              <label className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-1.5 block">
                Space Complexity
              </label>
              <input
                type="text"
                value={tracker?.spaceComplexity || ""}
                onChange={(e) => onUpdate({ ...tracker, spaceComplexity: e.target.value })}
                placeholder="e.g., O(n)"
                className="w-full text-sm bg-surface border border-border rounded-lg px-3 py-2
                  text-text placeholder:text-text-muted/50 outline-none focus:border-primary/50"
              />
            </div>

            {/* Date Solved */}
            <div>
              <label className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-1.5 block">
                Date Solved
              </label>
              <input
                type="date"
                value={tracker?.dateSolved || ""}
                onChange={(e) => onUpdate({ ...tracker, dateSolved: e.target.value })}
                className="w-full text-sm bg-surface border border-border rounded-lg px-3 py-2
                  text-text outline-none focus:border-primary/50
                  [color-scheme:dark]"
              />
            </div>

            {/* Revision Count */}
            <div>
              <label className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-1.5 block">
                Revisions
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={tracker?.revisions || 0}
                  onChange={(e) =>
                    onUpdate({ ...tracker, revisions: parseInt(e.target.value) || 0 })
                  }
                  className="w-20 text-sm bg-surface border border-border rounded-lg px-3 py-2
                    text-text outline-none focus:border-primary/50"
                />
                <span className="text-xs text-text-muted">times revised</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
