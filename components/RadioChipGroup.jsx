"use client";

import { useState } from "react";

/**
 * Single-select "radio chip" control (e.g. Venue Type).
 * Behaves like a radio group but styled as pill buttons.
 */
export default function RadioChipGroup({ options, name, onChange, compact = false }) {
  const [selected, setSelected] = useState(null);

  function select(value) {
    setSelected(value);
    onChange?.(value);
  }

  return (
    <div className={`flex flex-wrap ${compact ? "gap-1.5" : "gap-2"}`} role="radiogroup" aria-label={name}>
      {options.map((opt) => {
        const isActive = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => select(opt.value)}
            className={`rounded-full font-medium border select-none transition-all duration-200 ${
              compact ? "px-[13px] py-[5px] text-[11px]" : "px-4 py-2 text-[13px]"
            } ${
              isActive
                ? "border-accent bg-accent/[0.08] text-accent"
                : "border-white/10 bg-bg3 text-muted hover:border-white/[0.16] hover:text-ink"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
      {selected && <input type="hidden" name={name} value={selected} />}
    </div>
  );
}
