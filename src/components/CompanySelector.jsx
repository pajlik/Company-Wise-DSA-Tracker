import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Building2, Star, ChevronDown } from "lucide-react";
import { COMPANIES, POPULAR_COMPANIES, formatCompanyName } from "../constants/companies";

export default function CompanySelector({ selected, onSelect }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) {
      const popularSet = new Set(POPULAR_COMPANIES);
      const rest = COMPANIES.filter((c) => !popularSet.has(c));
      return [...POPULAR_COMPANIES, ...rest];
    }
    return COMPANIES.filter(
      (c) =>
        c.includes(q) || formatCompanyName(c).toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-surface-light border border-border rounded-xl
                   hover:border-primary/50 transition-all cursor-pointer text-left"
      >
        <Building2 size={18} className="text-primary-light shrink-0" />
        <span className={selected ? "text-text" : "text-text-muted"}>
          {selected ? formatCompanyName(selected) : "Select a company..."}
        </span>
        <ChevronDown
          size={16}
          className={`ml-auto text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-surface border border-border rounded-xl shadow-2xl overflow-hidden">
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-2 px-3 py-2 bg-surface-light rounded-lg">
              <Search size={16} className="text-text-muted" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies..."
                className="bg-transparent border-none outline-none text-sm text-text w-full placeholder:text-text-muted"
              />
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="px-4 py-6 text-text-muted text-sm text-center">No companies found</p>
            )}
            {!search && (
              <div className="px-3 pt-2 pb-1">
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold flex items-center gap-1">
                  <Star size={10} /> Popular
                </span>
              </div>
            )}
            {filtered.map((company, i) => (
              <button
                key={company}
                onClick={() => {
                  onSelect(company);
                  setOpen(false);
                  setSearch("");
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-primary/10 transition-colors cursor-pointer
                  ${company === selected ? "bg-primary/15 text-primary-light" : "text-text"}
                  ${!search && i === POPULAR_COMPANIES.length ? "border-t border-border mt-1 pt-3" : ""}`}
              >
                {formatCompanyName(company)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
