"use client";

import { cn } from "@/lib/utils";

interface XCardProps {
  author?: string;
  handle?: string;
  avatar?: string;
  content?: string[];
  verified?: boolean;
  likes?: number;
  retweets?: number;
  replies?: number;
  className?: string;
}

export function XCard({
  author = "Mohammed Barbar",
  handle = "@mohammedbarbar",
  content = ["Just shipped something insane 🚀", "The future is being built right now."],
  verified = true,
  likes = 2400,
  retweets = 847,
  replies = 128,
  className,
}: XCardProps) {
  return (
    <div
      className={cn(
        "relative w-full max-w-sm rounded-2xl overflow-hidden p-px",
        className
      )}
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 100%)",
      }}
    >
      <div
        className="relative rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, #16181c 0%, #0a0a0b 100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #00FFB2, #38BDF8)" }}
            >
              {author[0]}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-white text-sm font-semibold">{author}</span>
                {verified && (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#1d9bf0]">
                    <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91-1.01-1-2.52-1.27-3.91-.81-.66-1.31-1.91-2.19-3.34-2.19-1.43 0-2.68.88-3.34 2.19-1.39-.46-2.9-.2-3.91.81-1 1.01-1.27 2.52-.81 3.91-1.31.67-2.19 1.91-2.19 3.34 0 1.43.88 2.67 2.19 3.34-.46 1.39-.2 2.9.81 3.91 1.01 1 2.52 1.27 3.91.81.66 1.31 1.91 2.19 3.34 2.19 1.43 0 2.67-.88 3.34-2.19 1.39.46 2.9.2 3.91-.81 1-1.01 1.27-2.52.81-3.91 1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                  </svg>
                )}
              </div>
              <span className="text-white/40 text-xs">{handle}</span>
            </div>
          </div>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white/60">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>

        {/* Content */}
        <div className="space-y-1 mb-4">
          {content.map((line, i) => (
            <p key={i} className="text-white/90 text-sm leading-relaxed">{line}</p>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-5 pt-3 border-t border-white/[0.06]">
          {[
            { icon: "💬", val: replies },
            { icon: "🔁", val: retweets },
            { icon: "♥", val: likes },
          ].map(({ icon, val }) => (
            <button key={icon} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-xs">
              <span>{icon}</span>
              <span>{val.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
