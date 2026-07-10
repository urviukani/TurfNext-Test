import Header from "@/components/Header";
import PlayerForm from "@/components/PlayerForm";

export const metadata = {
  title: "Player Registration",
  description:
    "Register as a player on TurfNext and be first in line when we go live in your city. Book turfs, get matched with players, and join tournaments.",
  alternates: {
    canonical: "/player",
  },
};

export default function PlayerPage() {
  return (
    <div className="relative z-[2] min-h-screen animate-pageIn">
      <Header variant="back" />
      <main className="max-w-[600px] mx-auto px-5 pt-2.5 pb-[clamp(50px,8vw,80px)]">
        <div className="bg-card border border-white/10 rounded-r3 p-[clamp(22px,5vw,38px)] shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
          <PlayerForm />
        </div>
      </main>
    </div>
  );
}
