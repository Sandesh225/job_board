import type { Config } from "tailwindcss";
import flowbitePlugin from "flowbite/plugin";
import flowbiteReact from "flowbite-react/plugin/tailwindcss";

const config: Config = {
  darkMode: "class", // Critical for manual toggle
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Explicit path to flowbite files
    "./node_modules/flowbite-react/dist/esm/**/*.mjs",
    ".flowbite-react\\class-list.json"
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbitePlugin, flowbiteReact],
};

export default config;