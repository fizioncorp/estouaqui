import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#123C36",
        pine: "#2F6F64",
        mint: "#DFF3EC",
        sky: "#DDEBFF",
        cream: "#F8F5EF",
        ink: "#263238",
        mist: "#EEF2F3",
        danger: "#B42318"
      },
      boxShadow: {
        soft: "0 12px 32px rgba(18, 60, 54, 0.12)"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  },
  plugins: []
} satisfies Config;
