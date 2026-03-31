import type { Config } from "tailwindcss";
import  fontFamily  from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-cairo)", ...fontFamily.sans],
        arabic: ["var(--font-cairo)"],
      },
      colors: {
        primary: {
          DEFAULT: "#1B6B3A",
          50:  "#F0FAF4",
          100: "#D4EDDA",
          200: "#A8DBB5",
          300: "#7CC990",
          400: "#50B76B",
          500: "#2E9550",
          600: "#1B6B3A",
          700: "#145230",
          800: "#0D3A22",
          900: "#072213",
        },
        gold: {
          DEFAULT: "#C9962A",
          light: "#FDF3DC",
          dark:  "#8B6218",
        },
        mosque: {
          bg:      "#F8FAF9",
          surface: "#FFFFFF",
          muted:   "#F1F5F2",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;