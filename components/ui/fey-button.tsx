"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface FeyButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function FeyButton({ children = "Get Started", className, onClick }: FeyButtonProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={onClick}
      className={cn("relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]", className)}
      style={{
        background: isDark
          ? "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 60%, transparent 100%), #1a1a1a"
          : "radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.02) 60%, transparent 100%), #f5f5f5",
        color: isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.82)",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
        boxShadow: isDark
          ? "0 1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)"
          : "0 1px 2px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      <svg
        viewBox="0 0 16 16"
        className="w-3.5 h-3.5"
        fill="none"
        stroke={isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"}
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <rect x="2" y="5" width="12" height="8" rx="1.5" />
        <path d="M5 5V3.5a3 3 0 016 0V5" />
      </svg>
      {children}
    </button>
  );
}
