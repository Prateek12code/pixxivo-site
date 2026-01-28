/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./x1.html",
    "./contact.html",
    "./src/**/*.js", // ✅ fixes warning
  ],
  theme: {
    extend: {
      colors: {
        base: {
          bg: "#F2F3F4",
          card: "#FFFFFF",
          ink: "#0B0F14",
          muted: "#4B5563",
          line: "#E4E7EB",
        },
        ink: {
          900: "#0B0F14",
          800: "#111827",
          700: "#1F2937",
          600: "#374151",
        },
      },
      boxShadow: {
        glass: "0 8px 30px rgba(15, 23, 42, 0.08)",
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [],
};
