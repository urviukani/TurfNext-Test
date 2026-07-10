/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0D0D0D",
        bg2: "#111111",
        bg3: "#1A1A1A",
        bg4: "#222222",
        card: "#161616",
        card2: "#1C1C1C",
        accent: "#C8FF00",
        accent2: "#b8ef00",
        muted: "#888888",
        muted2: "#555555",
        ink: "#F0F0F0",
        fb: "#3b82f6",
        cr: "#f59e0b",
        bd: "#8b5cf6",
        pk: "#ec4899",
      },
      fontFamily: {
        body: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
        display: ["Arial Black", "Arial", "sans-serif"],
      },
      borderRadius: {
        r: "8px",
        r2: "14px",
        r3: "20px",
        r4: "28px",
      },
      keyframes: {
        floatA: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(60px,80px) scale(1.08)" },
        },
        floatB: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(-50px,60px) scale(1.05)" },
        },
        floatC: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(70px,-50px) scale(1.1)" },
        },
        pulseDot: {
          "0%": { boxShadow: "0 0 0 0 rgba(200,255,0,0.3)" },
          "70%": { boxShadow: "0 0 0 8px rgba(200,255,0,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(200,255,0,0)" },
        },
        pageIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        floatA: "floatA 22s ease-in-out infinite",
        floatB: "floatB 26s ease-in-out infinite",
        floatBRev: "floatB 30s ease-in-out infinite reverse",
        floatC: "floatC 24s ease-in-out infinite",
        pulseDot: "pulseDot 1.8s infinite",
        pageIn: "pageIn 0.45s ease",
      },
    },
  },
  plugins: [],
};
