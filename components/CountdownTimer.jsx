"use client";

import { useEffect, useState } from "react";

function pad(n) {
  return String(n).padStart(2, "0");
}

/**
 * Renders a live Days / Hours / Mins / Secs countdown.
 * The target launch date is fixed 30 days out from the moment the page
 * first renders on the client, matching the original script's behavior.
 * Starts as "--" on the server/first paint to avoid any hydration mismatch,
 * then fills in on mount.
 */
export default function CountdownTimer() {
  const [time, setTime] = useState({ d: "--", h: "--", m: "--", s: "--" });

  useEffect(() => {
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30);

    function update() {
      const now = new Date();
      let diff = launchDate - now;
      if (diff < 0) diff = 0;
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTime({ d: pad(d), h: pad(h), m: pad(m), s: pad(s) });
    }

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "Days", value: time.d },
    { label: "Hours", value: time.h },
    { label: "Mins", value: time.m },
    { label: "Secs", value: time.s },
  ];

  return (
    <div
      className="flex justify-center gap-[clamp(6px,2vw,10px)] mb-9 flex-wrap"
      role="timer"
      aria-live="polite"
      aria-label="Countdown to launch"
    >
      {units.map((u) => (
        <div
          key={u.label}
          className="bg-card border border-white/10 rounded-r2 px-[clamp(12px,3vw,20px)] py-[clamp(10px,2vw,16px)] min-w-[66px] text-center flex-none"
        >
          <div className="font-mono text-[clamp(20px,5vw,34px)] font-bold text-accent leading-none">
            {u.value}
          </div>
          <div className="text-[9.5px] text-muted tracking-[1.5px] uppercase mt-1.5">
            {u.label}
          </div>
        </div>
      ))}
    </div>
  );
}
