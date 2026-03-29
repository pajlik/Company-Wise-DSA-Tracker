import { useState } from "react";
import { ExternalLink, Check, Clock, RotateCcw, Circle, NotebookPen } from "lucide-react";
import QuestionDetailModal from "./QuestionDetailModal";

const STATUS_OPTIONS = [
  { value: "unsolved",    label: "Unsolved",     icon: Circle,    color: "text-text-muted",    bg: "bg-surface-lighter" },
  { value: "in-progress", label: "In Progress",  icon: Clock,     color: "text-medium",        bg: "bg-medium/20" },
  { value: "solved",      label: "Solved",       icon: Check,     color: "text-easy",          bg: "bg-easy/20" },
  { value: "review",      label: "Needs Review", icon: RotateCcw, color: "text-primary-light", bg: "bg-primary/20" },
];

const DIFFICULTY_COLORS = {
  Easy:   "text-easy bg-easy/10 border-easy/20",
  Medium: "text-medium bg-medium/10 border-medium/20",
  Hard:   "text-hard bg-hard/10 border-hard/20",
};

export default function QuestionRow({ question, tracker, onUpdate }) {
  const [modalOpen, setModalOpen] = useState(false);
  const currentStatus = tracker?.status || "unsolved";
  const hasNotes = tracker?.notes || tracker?.approach || tracker?.timeComplexity;

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className={`grid grid-cols-[40px_1fr_100px_90px_90px_150px_36px] items-center gap-3 px-4 py-3
          border-b border-border/50 last:border-b-0 hover:bg-surface-light/50 transition-colors cursor-pointer
          ${currentStatus === "solved" ? "opacity-60" : ""}`}
      >
        {/* ID */}
        <span className="text-xs text-text-muted font-mono">{question.id}</span>

        {/* Title — click opens modal */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm text-text truncate font-medium">
            {question.title}
          </span>
          <a
            href={question.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 text-text-muted hover:text-primary-light transition-colors"
          >
            <ExternalLink size={12} />
          </a>
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
              className="h-full bg-primary rounded-full"
              style={{ width: question.frequency }}
            />
          </div>
          <span className="text-[10px] text-text-muted w-10 text-right">{question.frequency}</span>
        </div>

        {/* Status toggle buttons */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {STATUS_OPTIONS.map(({ value, label, icon: Icon, color, bg }) => {
            const active = currentStatus === value;
            return (
              <button
                key={value}
                title={label}
                onClick={() => onUpdate({ ...tracker, status: value })}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  active
                    ? `${bg} ${color}`
                    : "text-text-muted/40 hover:text-text-muted hover:bg-surface-lighter"
                }`}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>

        {/* Notes button */}
        <button
          onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
          title="Open notes"
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            hasNotes
              ? "text-primary-light bg-primary/10 hover:bg-primary/20"
              : "text-text-muted/40 hover:text-text-muted hover:bg-surface-lighter"
          }`}
        >
          <NotebookPen size={14} />
        </button>
      </div>

      {modalOpen && (
        <QuestionDetailModal
          question={question}
          tracker={tracker}
          onUpdate={onUpdate}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
