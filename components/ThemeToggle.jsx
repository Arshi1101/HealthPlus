'use client';
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
  onClick={toggleTheme}
  className="w-10 h-10 flex items-center justify-center rounded-lg 
  bg-black/50 dark:bg-gray-800 border border-cyan-400/50 
  text-xl transition-colors duration-300 hover:border-cyan-400"
>
  {theme === "dark" ? "🌙" : "☀️"}
</button>


  );
}