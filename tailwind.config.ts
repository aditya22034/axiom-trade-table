import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F17",
        card: "#0F1522",
        border: "#1E283A",
        hover: "#121A2A",
        textPrimary: "#E5ECF4",
        textMuted: "#9AA7B8",
        up: "#14C38E",
        down: "#EF4444",
        accent: "#1E5EFF"
      }
    }
  },
  darkMode: "class"
};

export default config;
