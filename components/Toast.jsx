"use client";

export default function Toast({ show, title, message, variant = "error" }) {
  return (
    <div className={`notify${show ? " show" : ""}`} role="status" aria-live="polite">
      <div className={`notify-title ${variant === "error" ? "text-red-500" : "text-accent"}`}>
        {title}
      </div>
      <div className="notify-msg">{message}</div>
    </div>
  );
}
