import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export type ThemeMode = "light" | "dark" | "auto";

interface ThemeOption {
  id: ThemeMode;
  label: string;
  mobileLabel: string;
  title: string;
  ariaLabel: string;
  icon: typeof Sun;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "light",
    label: "Light Mode",
    mobileLabel: "Light",
    title: "Light Mode",
    ariaLabel: "Switch to Light Mode",
    icon: Sun,
  },
  {
    id: "dark",
    label: "Dark Mode",
    mobileLabel: "Dark",
    title: "Dark Mode",
    ariaLabel: "Switch to Dark Mode",
    icon: Moon,
  },
  {
    id: "auto",
    label: "Auto (Device)",
    mobileLabel: "Auto",
    title: "Auto: Based on device theme",
    ariaLabel: "Auto: Based on device theme",
    icon: Monitor,
  },
];

export default function ThemeSelector() {
  const [theme, setTheme] = useState<ThemeMode>("auto");
  const [mounted, setMounted] = useState(false);

  const applyTheme = (mode: ThemeMode) => {
    const isDark =
      mode === "dark" ||
      (mode === "auto" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", isDark);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", isDark ? "#0E0E0C" : "#F4F1EA");
    }
  };

  useEffect(() => {
    setMounted(true);
    let initialTheme: ThemeMode = "auto";
    try {
      const stored = localStorage.getItem("theme") as ThemeMode | null;
      if (stored === "light" || stored === "dark" || stored === "auto") {
        initialTheme = stored;
      }
    } catch {}

    setTheme(initialTheme);
    applyTheme(initialTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      let currentMode: ThemeMode = "auto";
      try {
        currentMode = (localStorage.getItem("theme") as ThemeMode) || "auto";
      } catch {}

      if (currentMode === "auto") {
        document.documentElement.classList.toggle("dark", e.matches);
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
          metaThemeColor.setAttribute("content", e.matches ? "#0E0E0C" : "#F4F1EA");
        }
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        const newMode = (e.newValue as ThemeMode) || "auto";
        setTheme(newMode);
        applyTheme(newMode);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const selectTheme = (mode: ThemeMode) => {
    setTheme(mode);
    try {
      localStorage.setItem("theme", mode);
    } catch {}
    applyTheme(mode);
  };

  return (
    <div
      className="theme-selector"
      role="group"
      aria-label="Color theme selection"
    >
      <div className="theme-pill-group" role="radiogroup" aria-label="Theme">
        {THEME_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = mounted && theme === option.id;
          return (
            <button
              key={option.id}
              type="button"
              className={`theme-pill-btn ${isActive ? "active" : ""}`}
              onClick={() => selectTheme(option.id)}
              aria-label={option.ariaLabel}
              title={option.title}
              role="radio"
              aria-checked={isActive}
            >
              <Icon size={13} className="theme-pill-icon" aria-hidden="true" />
              <span className="theme-pill-text">
                <span className="hidden sm:inline">{option.label}</span>
                <span className="sm:hidden">{option.mobileLabel}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
