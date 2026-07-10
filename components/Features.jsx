const FEATURES = [
  {
    icon: "📍",
    title: "Instant Turf Booking",
    body: "Real-time slot availability across verified venues in your city — no calling, no waiting.",
  },
  {
    icon: "🤝",
    title: "AI Player Matching",
    body: "Get matched with players at your skill level to fill your squad or join a game near you.",
  },
  {
    icon: "🏆",
    title: "Tournaments & Leagues",
    body: "Join city-wide tournaments across football, cricket, badminton, pickleball & more.",
  },
];

export default function Features() {
  return (
    <section className="relative z-[2] max-w-[1100px] mx-auto px-5 pt-5 pb-[clamp(50px,8vw,70px)]">
      <p className="text-[11px] font-bold tracking-[3px] text-accent uppercase mb-2.5 text-center">
        What&apos;s Coming
      </p>
      <h2 className="font-display font-black text-[clamp(22px,4vw,36px)] text-center tracking-[-1px] mb-9">
        Built for players. <span className="text-accent">Built for owners.</span>
      </h2>

      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(230px,1fr))]">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-card border border-white/[0.06] rounded-r2 p-6 transition-all duration-[250ms] hover:border-white/[0.16] hover:-translate-y-[3px]"
          >
            <div
              className="w-10 h-10 rounded-[10px] bg-accent/[0.08] border border-accent/[0.19] flex items-center justify-center mb-3.5 text-lg"
              aria-hidden="true"
            >
              {f.icon}
            </div>
            <h3 className="text-[15.5px] font-bold mb-2">{f.title}</h3>
            <p className="text-muted text-[13px] leading-[1.65]">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
