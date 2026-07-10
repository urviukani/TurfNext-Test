"use client";

import { useState } from "react";

/**
 * Multi-select "chip" control (e.g. Sports Interested In).
 * Clicking a chip toggles it in/out of the selected set.
 * Selected values are exposed to the parent form via onChange.
 */
export default function ChipGroup({ options, name, onChange, compact = false }) {
  const [selected, setSelected] = useState([]);

  function toggle(value) {
    setSelected((prev) => {
      const next = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
      onChange?.(next);
      return next;
    });
  }

  return (
    <div
      className={`flex flex-wrap ${compact ? "gap-1.5" : "gap-2"}`}
      role="group"
      aria-label={name}
    >
      {options.map((opt) => {
        const isActive = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            aria-pressed={isActive}
            className={`rounded-full font-medium border select-none transition-all duration-200 ${
              compact ? "px-[11px] py-[5px] text-[11px]" : "px-[15px] py-2 text-[13px]"
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
      {/* Hidden inputs keep the selected chips part of native form submission */}
      {selected.map((v) => (
        <input key={v} type="hidden" name={name} value={v} />
      ))}
    </div>
  );
}
