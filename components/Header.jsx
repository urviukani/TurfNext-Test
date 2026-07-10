import Link from "next/link";
import Logo from "./Logo";

/**
 * Top navigation bar shared across every route.
 * variant="home"  -> shows the pulsing "LAUNCHING SOON" tag
 * variant="back"  -> shows a "Back to Home" link (used on /player and /owner)
 */
export default function Header({ variant = "home", compact = false }) {
  return (
    <nav
      className={`relative z-[5] flex items-center justify-between gap-3 w-full max-w-[1200px] mx-auto flex-wrap ${
        compact ? "px-6 py-[clamp(8px,1.6vh,20px)]" : "px-6 py-5"
      }`}
    >
      <Logo />

      {variant === "home" ? (
        <div className="font-mono text-[10.5px] text-muted tracking-[1.5px] px-3 py-1.5 border border-white/10 rounded-full flex items-center gap-[7px] whitespace-nowrap">
          <span
            className="w-1.5 h-1.5 rounded-full bg-accent animate-pulseDot"
            aria-hidden="true"
          />
          LAUNCHING SOON
        </div>
      ) : (
        <Link
          href="/"
          className="inline-flex items-center gap-[7px] text-muted text-[13px] font-semibold bg-bg3 border border-white/10 px-3.5 py-2 rounded-full no-underline transition-all duration-200 hover:text-ink hover:border-white/[0.16]"
        >
          ← Back to Home
        </Link>
      )}
    </nav>
  );
}
