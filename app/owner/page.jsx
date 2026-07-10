import Header from "@/components/Header";
import OwnerForm from "@/components/OwnerForm";

export const metadata = {
  title: "List Your Turf",
  description:
    "Partner with TurfNext and fill your slots faster. List your venue, pin its location on the map, and reach players across your city.",
  alternates: {
    canonical: "/owner",
  },
};

export default function OwnerPage() {
  return (
    <div className="relative z-[2] flex flex-col h-screen h-[100dvh] overflow-hidden animate-pageIn">
      <Header variant="back" compact />
      <div className="flex-1 min-h-0 overflow-hidden flex items-center justify-center px-5">
        <div className="w-full max-w-[600px] max-h-full overflow-y-auto no-scrollbar bg-card border border-white/10 rounded-r3 p-[clamp(10px,2.2vh,26px)_clamp(16px,3vw,26px)] shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
          <OwnerForm />
        </div>
      </div>
    </div>
  );
}
