import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vibe OS — AI Chief of Staff for SaaS Founders",
  description:
    "7 AI agents that remember your project, sharpen your prompts, debug your errors, and tell you exactly what to build next.",
  openGraph: {
    title: "Vibe OS",
    description: "The AI chief of staff for vibe coders",
    url: "https://vibeos.app",
    siteName: "Vibe OS",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
