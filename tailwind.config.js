/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pk: {
          orange: {
            start: "#F97316", // top-left of gradient
            end: "#EA580C",   // bottom-right of gradient
          },
          purple: "#7C3AED", // "PythonKid" logo text on white panel
          text: {
            dark: "#0F172A",  // headings on white panel
            muted: "#64748B", // subtext / "Made by Kids, for Kids"
          },
          border: "#E2E8F0", // button borders on white panel
        },
      },
    },
  },
  plugins: [],
};