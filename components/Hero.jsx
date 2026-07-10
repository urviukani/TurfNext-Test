import Link from "next/link";
import CountdownTimer from "./CountdownTimer";

const SPORTS = ["⚽ Football", "🏏 Cricket", "🎾 Pickleball", "🏸 Badminton", "🎾 Tennis"];

export default function Hero() {
  return (
    <section className="relative z-[2] max-w-[820px] mx-auto px-5 pt-[clamp(30px,7vw,60px)] pb-5 text-center">
      <span className="inline-flex items-center gap-2 px-4 py-[7px] rounded-full border border-accent/[0.19] bg-accent/[0.08] text-accent text-[11.5px] font-bold tracking-[1.2px] uppercase mb-6 font-mono">
        🚀 India&apos;s Sports OS — Coming Soon
      </span>

      <h1 className="font-display font-black text-[clamp(34px,8vw,74px)] leading-[1.04] tracking-[-2px] mb-[18px]">
        Every City.
        <br />
        Every Sport.
        <br />
        <span className="text-accent">One App.</span>
      </h1>

      <p className="text-muted text-[clamp(14px,2vw,18px)] max-w-[560px] mx-auto mb-[34px] leading-[1.75] px-2">
        Book verified turfs instantly, get AI-matched with players at your
        skill level, and compete in tournaments — all in one app. We&apos;re
        putting the final touches on it.
      </p>

      <CountdownTimer />

      <div className="flex gap-3.5 justify-center flex-wrap mb-3.5 px-2">
        <Link
          href="/player"
          className="inline-flex items-center gap-[9px] justify-center px-[26px] py-[15px] rounded-r text-[14.5px] font-bold bg-accent text-black no-underline whitespace-nowrap transition-all duration-200 hover:bg-accent2 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(200,255,0,0.19)] w-full sm:w-auto"
        >
          🏃 Register as a Player
        </Link>
        <Link
          href="/owner"
          className="inline-flex items-center gap-[9px] justify-center px-[26px] py-[15px] rounded-r text-[14.5px] font-bold bg-transparent text-ink border border-white/[0.16] no-underline whitespace-nowrap transition-all duration-200 hover:border-accent hover:text-accent hover:-translate-y-0.5 w-full sm:w-auto"
        >
          🏟️ List Your Turf
        </Link>
      </div>
      <div className="text-muted2 text-xs mb-[60px] px-5">
        No payment required — early registrants get priority access &amp;
        launch offers.
      </div>

      <ul className="flex justify-center flex-wrap gap-2 mt-2 px-3 list-none">
        {SPORTS.map((sport) => (
          <li
            key={sport}
            className="px-4 py-[7px] rounded-full text-[12.5px] font-semibold border border-white/10 bg-bg3 text-muted whitespace-nowrap"
          >
            {sport}
          </li>
        ))}
      </ul>
    </section>
  );
}
