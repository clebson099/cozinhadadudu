/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sage: { DEFAULT: "#A8B8A0", light: "#C2CFBB", dark: "#8A9A82" },
        peach: { DEFAULT: "#F2B38D", light: "#F8CFB3", dark: "#E69C70" },
        cream: { DEFAULT: "#F9F6F1", dark: "#EFE9E0" },
        graphite: { DEFAULT: "#2F3A3A", light: "#4A5757" },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        display: ["'Fraunces'", "Georgia", "serif"],
      },
      borderRadius: { xl2: "1.25rem", xl3: "1.75rem" },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(47,58,58,0.10)",
        card: "0 8px 30px -8px rgba(47,58,58,0.12)",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "pop": { "0%": { transform: "scale(0.96)" }, "100%": { transform: "scale(1)" } },
      },
      animation: { "fade-in": "fade-in 0.4s ease-out", "pop": "pop 0.2s ease-out" },
    },
  },
  plugins: [],
}
