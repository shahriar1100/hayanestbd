"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle({ variant = "icon" }: { variant?: "icon" | "menu" }) {
  const [light, setLight] = useState(false);
  useEffect(() => { const frame = requestAnimationFrame(() => setLight(document.documentElement.dataset.theme === "light")); return () => cancelAnimationFrame(frame); }, []);
  function toggle() { const next = !light; setLight(next); document.documentElement.dataset.theme = next ? "light" : "dark"; localStorage.setItem("haya-theme", next ? "light" : "dark"); }
  if (variant === "menu") return <button className="menu-theme-toggle" onClick={toggle} aria-label={`Switch to ${light ? "dark" : "light"} mode`} aria-pressed={!light}><span>{light ? <Moon size={19} /> : <Sun size={19} />}<b>Dark mode</b></span><i aria-hidden="true"><em /></i></button>;
  return <button className="icon-btn" onClick={toggle} aria-label="Toggle colour theme">{light ? <Moon size={18} /> : <Sun size={18} />}</button>;
}
