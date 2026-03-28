import { CheckCircle, Clock, RotateCcw, Target } from "lucide-react";

export default function StatsBar({ questions, trackerData }) {
  const total = questions.length;
  const solved = questions.filter((q) => trackerData[q.id]?.status === "solved").length;
  const inProgress = questions.filter((q) => trackerData[q.id]?.status === "in-progress").length;
  const review = questions.filter((q) => trackerData[q.id]?.status === "review").length;

  const easy = questions.filter((q) => q.difficulty === "Easy").length;
  const medium = questions.filter((q) => q.difficulty === "Medium").length;
  const hard = questions.filter((q) => q.difficulty === "Hard").length;

  const easySolved = questions.filter((q) => q.difficulty === "Easy" && trackerData[q.id]?.status === "solved").length;
  const mediumSolved = questions.filter((q) => q.difficulty === "Medium" && trackerData[q.id]?.status === "solved").length;
  const hardSolved = questions.filter((q) => q.difficulty === "Hard" && trackerData[q.id]?.status === "solved").length;

  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="bg-surface-light border border-border rounded-xl px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-text">Overall Progress</span>
          <span className="text-sm font-bold text-primary-light">{pct}%</span>
        </div>
        <div className="h-2 bg-surface-lighter rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
          <span className="text-easy font-medium">{easySolved}/{easy} Easy</span>
          <span className="text-medium font-medium">{mediumSolved}/{medium} Medium</span>
          <span className="text-hard font-medium">{hardSolved}/{hard} Hard</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<Target size={18} />}
          label="Total"
          value={total}
          sub={`${easy}E · ${medium}M · ${hard}H`}
          color="text-primary-light"
          bg="bg-primary/10"
        />
        <StatCard
          icon={<CheckCircle size={18} />}
          label="Solved"
          value={solved}
          sub={`${pct}% complete`}
          color="text-easy"
          bg="bg-easy/10"
        />
        <StatCard
          icon={<Clock size={18} />}
          label="In Progress"
          value={inProgress}
          sub={inProgress > 0 ? "keep going!" : "none yet"}
          color="text-medium"
          bg="bg-medium/10"
        />
        <StatCard
          icon={<RotateCcw size={18} />}
          label="Needs Review"
          value={review}
          sub={review > 0 ? "revisit soon" : "all good"}
          color="text-primary-light"
          bg="bg-primary/10"
        />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color, bg }) {
  return (
    <div className="bg-surface-light border border-border rounded-xl px-4 py-3">
      <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-2`}>
        <span className={color}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-text">{value}</p>
      <p className="text-xs text-text-muted font-medium mt-0.5">{label}</p>
      {sub && <p className="text-[11px] text-text-muted/70 mt-0.5">{sub}</p>}
    </div>
  );
}
