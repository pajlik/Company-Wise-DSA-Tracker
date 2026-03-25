import { CheckCircle, Clock, RotateCcw, Target } from "lucide-react";

export default function StatsBar({ questions, trackerData }) {
  const total = questions.length;
  const solved = questions.filter((q) => trackerData[q.id]?.status === "solved").length;
  const inProgress = questions.filter((q) => trackerData[q.id]?.status === "in-progress").length;
  const review = questions.filter((q) => trackerData[q.id]?.status === "review").length;

  const easy = questions.filter((q) => q.difficulty === "Easy").length;
  const medium = questions.filter((q) => q.difficulty === "Medium").length;
  const hard = questions.filter((q) => q.difficulty === "Hard").length;

  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        icon={<Target size={18} />}
        label="Total"
        value={total}
        sub={`${easy}E / ${medium}M / ${hard}H`}
        color="text-primary-light"
      />
      <StatCard
        icon={<CheckCircle size={18} />}
        label="Solved"
        value={solved}
        sub={`${pct}% complete`}
        color="text-easy"
      />
      <StatCard
        icon={<Clock size={18} />}
        label="In Progress"
        value={inProgress}
        color="text-medium"
      />
      <StatCard
        icon={<RotateCcw size={18} />}
        label="Needs Review"
        value={review}
        color="text-primary-light"
      />
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="bg-surface-light border border-border rounded-xl px-4 py-3">
      <div className="flex items-center gap-2 mb-1">
        <span className={color}>{icon}</span>
        <span className="text-xs text-text-muted uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold text-text">{value}</p>
      {sub && <p className="text-xs text-text-muted mt-0.5">{sub}</p>}
    </div>
  );
}
