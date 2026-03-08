import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const themes = {
  dark: {
    bg: "#070B14",
    surface: "#0D1220",
    surface2: "#111827",
    border: "#1E2D45",
    text: "#E2E8F0",
    text2: "#8899AA",
    text3: "#4A5568",
    accent: "#0EA5E9",
    accent2: "#6366F1",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    inputBg: "#070B14",
    navBg: "#0A0F1C",
  },
  light: {
    bg: "#F0F4FA",
    surface: "#FFFFFF",
    surface2: "#F8FAFC",
    border: "#E2E8F0",
    text: "#0F172A",
    text2: "#475569",
    text3: "#94A3B8",
    accent: "#0284C7",
    accent2: "#4F46E5",
    success: "#059669",
    warning: "#D97706",
    danger: "#DC2626",
    inputBg: "#F8FAFC",
    navBg: "#FFFFFF",
  },
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const theme = themes[isDark ? "dark" : "light"];

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);