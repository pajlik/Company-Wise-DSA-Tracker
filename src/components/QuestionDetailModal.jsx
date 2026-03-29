import { X, FileText, Lightbulb, Timer, Database, CalendarDays, RefreshCw, ExternalLink } from "lucide-react";

const DIFFICULTY_COLORS = {
  Easy:   "text-easy bg-easy/10 border-easy/20",
  Medium: "text-medium bg-medium/10 border-medium/20",
  Hard:   "text-hard bg-hard/10 border-hard/20",
};

function Field({ icon: Icon, label, children }) {
  return (
    <div className="bg-surface-light border border-border/60 rounded-xl p-4 flex flex-col gap-2">
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

export default function QuestionDetailModal({ question, tracker, onUpdate, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-surface border border-border rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xs text-text-muted font-mono shrink-0">#{question.id}</span>
            <a
              href={question.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold text-text hover:text-primary-light transition-colors truncate flex items-center gap-1.5"
            >
              {question.title}
              <ExternalLink size={13} className="shrink-0 text-text-muted" />
            </a>
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full border shrink-0 ${
                DIFFICULTY_COLORS[question.difficulty] || "text-text-muted"
              }`}
            >
              {question.difficulty}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-light text-text-muted hover:text-text transition-colors shrink-0 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 grid grid-cols-2 gap-4">
          <Field icon={FileText} label="Notes">
            <textarea
              value={tracker?.notes || ""}
              onChange={(e) => onUpdate({ ...tracker, notes: e.target.value })}
              placeholder="Add your notes..."
              rows={7}
              className="w-full text-sm bg-transparent text-text placeholder:text-text-muted/40 outline-none resize-none"
            />
          </Field>

          <Field icon={Lightbulb} label="Approach">
            <textarea
              value={tracker?.approach || ""}
              onChange={(e) => onUpdate({ ...tracker, approach: e.target.value })}
              placeholder="Describe your approach..."
              rows={7}
              className="w-full text-sm bg-transparent text-text placeholder:text-text-muted/40 outline-none resize-none"
            />
          </Field>

          <Field icon={Timer} label="Time Complexity">
            <input
              type="text"
              value={tracker?.timeComplexity || ""}
              onChange={(e) => onUpdate({ ...tracker, timeComplexity: e.target.value })}
              placeholder="e.g. O(n log n)"
              className="w-full text-sm bg-transparent text-text placeholder:text-text-muted/40 outline-none"
            />
          </Field>

          <Field icon={Database} label="Space Complexity">
            <input
              type="text"
              value={tracker?.spaceComplexity || ""}
              onChange={(e) => onUpdate({ ...tracker, spaceComplexity: e.target.value })}
              placeholder="e.g. O(n)"
              className="w-full text-sm bg-transparent text-text placeholder:text-text-muted/40 outline-none"
            />
          </Field>

          <Field icon={CalendarDays} label="Date Solved">
            <input
              type="date"
              value={tracker?.dateSolved || ""}
              onChange={(e) => onUpdate({ ...tracker, dateSolved: e.target.value })}
              className="w-full text-sm bg-transparent text-text outline-none [color-scheme:dark]"
            />
          </Field>

          <Field icon={RefreshCw} label="Revisions">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onUpdate({ ...tracker, revisions: Math.max(0, (tracker?.revisions || 0) - 1) })}
                className="w-7 h-7 rounded-lg bg-surface border border-border text-text-muted
                  hover:text-text hover:border-primary/40 transition-colors font-bold cursor-pointer"
              >
                −
              </button>
              <span className="text-xl font-bold text-text min-w-[24px] text-center">
                {tracker?.revisions || 0}
              </span>
              <button
                onClick={() => onUpdate({ ...tracker, revisions: (tracker?.revisions || 0) + 1 })}
                className="w-7 h-7 rounded-lg bg-surface border border-border text-text-muted
                  hover:text-text hover:border-primary/40 transition-colors font-bold cursor-pointer"
              >
                +
              </button>
              <span className="text-xs text-text-muted">times revised</span>
            </div>
          </Field>
        </div>
      </div>
    </div>
  );
}
