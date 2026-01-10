"use client";

import { HiMoon, HiSun } from "react-icons/hi"; 
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // 1. On mount, check the current theme
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("flowbite-theme-mode");
    const themeIsDark = 
      savedTheme === "dark" || 
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    setIsDark(themeIsDark);
  }, []);

  // 2. Handle the toggle
  const toggleTheme = () => {
    const newTheme = !isDark ? "dark" : "light";
    setIsDark(!isDark);
    
    // Update Local Storage (ThemeModeScript looks for this key)
    localStorage.setItem("flowbite-theme-mode", newTheme);
    
    // Update the DOM class immediately
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Prevent hydration flicker
  if (!mounted) {
    return <div className="p-2.5 w-10 h-10"></div>;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition-all"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <HiSun className="w-5 h-5" />
      ) : (
        <HiMoon className="w-5 h-5" />
      )}
    </button>
  );
}