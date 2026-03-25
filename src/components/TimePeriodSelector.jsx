import { TIME_PERIODS } from "../constants/companies";

export default function TimePeriodSelector({ selected, onSelect }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {TIME_PERIODS.map((tp) => (
        <button
          key={tp.value}
          onClick={() => onSelect(tp.value)}
          className={`px-4 py-2 text-sm rounded-lg border transition-all cursor-pointer
            ${
              selected === tp.value
                ? "bg-primary border-primary text-white"
                : "bg-surface-light border-border text-text-muted hover:border-primary/50 hover:text-text"
            }`}
        >
          {tp.label}
        </button>
      ))}
    </div>
  );
}
