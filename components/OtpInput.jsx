"use client";

import { useRef } from "react";

export default function OtpInput({ length = 6, value, onChange, hasError = false }) {
  const inputsRef = useRef([]);
  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  function setDigit(index, digit) {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join(""));
  }

  function handleChange(e, index) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (!raw) {
      setDigit(index, "");
      return;
    }
    const chars = raw.split("");
    const next = digits.slice();
    let i = index;
    for (const ch of chars) {
      if (i >= length) break;
      next[i] = ch;
      i++;
    }
    onChange(next.join(""));
    inputsRef.current[Math.min(i, length - 1)]?.focus();
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[index]) {
        setDigit(index, "");
      } else if (index > 0) {
        setDigit(index - 1, "");
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length);
    if (!pasted) return;
    const next = pasted.split("").concat(Array(length).fill("")).slice(0, length);
    onChange(next.join(""));
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
  }

  return (
    <div className="flex gap-2.5 justify-center" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className={`w-12 h-14 text-center text-xl font-bold bg-bg3 border rounded-r text-ink outline-none transition-colors duration-200 focus:border-accent ${
            hasError ? "border-red-500" : "border-white/10"
          }`}
        />
      ))}
    </div>
  );
}
