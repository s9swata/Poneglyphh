import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E3FF8F",
        black: "#22242A",
        "grey-1": "#415762",
        "grey-2": "#B3BDBD",
        "grey-3": "#E5E6E6",
        "grey-35": "#F2F3F3",
        "grey-4": "#F7F8F8",
        error: "#EE4444",
        success: "#37955B",
        blue: "#25C5FA",
      },
      fontFamily: {
        onest: ["var(--font-onest)", "sans-serif"],
      },
      fontSize: {
        "heading-1": ["70px", { lineHeight: "1em", letterSpacing: "-0.03em" }],
        "heading-2": ["60px", { lineHeight: "1em", letterSpacing: "-0.02em" }],
        "heading-3": ["48px", { lineHeight: "1.05em", letterSpacing: "-0.02em" }],
        "heading-4": ["36px", { lineHeight: "1.1em", letterSpacing: "-0.02em" }],
        "heading-5": ["28px", { lineHeight: "1.3em", letterSpacing: "-0.01em" }],
        "heading-6": ["20px", { lineHeight: "1.3em" }],
        "body-lg": ["20px", { lineHeight: "1.4em" }],
        "body-md": ["18px", { lineHeight: "1.55em" }],
        body: ["16px", { lineHeight: "1.45em" }],
        "body-sm": ["14px", { lineHeight: "1.5em" }],
        sub: ["12px", { lineHeight: "12px", letterSpacing: "0.06em" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      maxWidth: {
        container: "1200px",
      },
      animation: {
        ticker: "ticker 20s linear infinite",
        "ticker-reverse": "ticker-reverse 20s linear infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "ticker-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
