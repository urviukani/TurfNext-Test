import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export const metadata = {
  title: "TurfNext — Every City. Every Sport. One App. | Coming Soon",
  description:
    "TurfNext is launching soon. India's AI-powered sports platform for booking turfs, finding players, and joining tournaments. Register now as a player or list your venue.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <div className="relative z-[2] min-h-screen animate-pageIn">
      <Header variant="home" />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
