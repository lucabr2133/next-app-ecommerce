import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors:{
       "davy-gray": {
          DEFAULT: "#4c4c4f",
          100: "#0f0f10",
          200: "#1e1e1f",
          300: "#2d2d2f",
          400: "#3c3c3e",
          500: "#4c4c4f",
          600: "#6e6e72",
          700: "#929296",
          800: "#b6b6b9",
          900: "#dbdbdc",
        },
        onyx: { 
          DEFAULT: "#3a3a3d", // me quedo con esta versión
          100: "#0b0b0c",
          200: "#171718",
          300: "#222224",
          400: "#2e2e30",
          500: "#3a3a3d",
          600: "#5f5f65",
          700: "#86868d",
          800: "#aeaeb3",
          900: "#d7d7d9",
        },
        jet: {
          DEFAULT: "#333335",
          100: "#0a0a0a",
          200: "#141415",
          300: "#1e1e1f",
          400: "#28282a",
          500: "#333335",
          600: "#5a5a5e",
          700: "#828287",
          800: "#acacaf",
          900: "#d5d5d7",
        },
        black: {
          DEFAULT: "#090909",
          100: "#020202",
          200: "#040404",
          300: "#060606",
          400: "#080808",
          500: "#090909",
          600: "#3b3b3b",
          700: "#6c6c6c",
          800: "#9d9d9d",
          900: "#cecece",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}

module.exports = config;