/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#171A20",
        secondary: "#282B35",
        default: "#2A2BFF",
        light: "#FFFFFF",
        // dark: '#1E40AF',
        // danger: '#EF4444',
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        inter: ["Inter", "sans-serif"], // keep this if you want to use font-inter too
      },
    },
  },
  plugins: [],
};
