/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./src/**/*.{js,jsx,ts,tsx}",],
   safelist: [
    "bg-variable-collection-color-1",
    "bg-variable-collection-color-2",
    "bg-variable-collection-color-3",
    "bg-variable-collection-color-4",
    "bg-variable-collection-color-5",
    "text-variable-collection-color-1",
    "text-variable-collection-color-2",
    "text-variable-collection-color-3",
    "text-variable-collection-color-4",
    "text-variable-collection-color-5",
    "border-variable-collection-color-4",
  ],
  theme: {
    extend: { 
           colors: {
        "variable-collection-11": "var(--variable-collection-11)",
        "variable-collection-color-1": "var(--variable-collection-color-1)",
        "variable-collection-color-2": "var(--variable-collection-color-2)",
        "variable-collection-color-3": "var(--variable-collection-color-3)",
        "variable-collection-color-4": "var(--variable-collection-color-4)",
        "variable-collection-color-5": "var(--variable-collection-color-5)",
      },
    },
  },
  plugins: [],
}

