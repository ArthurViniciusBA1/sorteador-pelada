"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

const THEME_COLOR = {
  light: "oklch(0.9934 0.0017 174.535)",
  dark: "oklch(0.1396 0.0125 174.6891)",
};

/** Keeps the mobile browser's status bar (the <meta name="theme-color"> tag) matching the
 * app's page background — the header is now an inset floating pill, not a full-bleed bar, so
 * the color touching the very top of the screen is the page background, not the header. */
export function ThemeColorSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const color = resolvedTheme === "dark" ? THEME_COLOR.dark : THEME_COLOR.light;
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", color);
  }, [resolvedTheme]);

  return null;
}
