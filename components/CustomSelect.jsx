"use client";

import { useState, useEffect, useRef } from "react";

/* Drop-in replacement for <select> — dark-theme dropdown with optional search. */
export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select",
  disabled = false,
  loadingText = "Loading...",
  hasError = false,
  searchable = true,
  searchPlaceholder = "Search...",
  emptyText = "No matches",
  compact = false,
}) {
  const normalized = options.map((o) =>
    typeof o === "string" || typeof o === "number"
      ? { value: o, label: String(o) }
      : o
  );

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = normalized.find((o) => o.value === value);
  const filtered = query
    ? normalized.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : normalized;

  const selectOption = (opt) => {
    onChange?.(opt.value);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`bg-bg3 border rounded-r text-ink font-body w-full flex items-center justify-between gap-2 transition-colors duration-200 ${
          compact
            ? "text-[clamp(12px,1.7vh,13.5px)] px-3 py-[clamp(6px,1.1vh,9px)]"
            : "text-[14.5px] px-[13px] py-3"
        } ${
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-white/20"
        } ${open ? "border-accent" : hasError ? "border-red-500" : "border-white/10"}`}
      >
        <span className={`truncate ${selected ? "text-ink" : "text-muted2"}`}>
          {disabled ? loadingText : selected?.label || placeholder}
        </span>
        <span className="text-[10px] text-muted shrink-0">▼</span>
      </div>
      {open && !disabled && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-bg2 border border-white/10 rounded-r z-30 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
          {searchable && (
            <input
              autoFocus
              type="text"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="m-1.5 w-[calc(100%-12px)] bg-bg3 border border-white/10 rounded-r text-ink text-[13px] px-2.5 py-1.5 outline-none focus:border-accent"
            />
          )}
          <div className="custom-select-list max-h-[200px] overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-[13px] py-2 text-[13px] text-muted">{emptyText}</div>
            )}
            {filtered.map((o) => (
              <div
                key={o.value}
                onClick={() => selectOption(o)}
                className={`px-[13px] py-2 text-[14px] cursor-pointer transition-colors duration-150 hover:bg-bg3 truncate ${
                  o.value === value ? "bg-accent/10 text-accent" : "text-ink"
                }`}
              >
                {o.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
