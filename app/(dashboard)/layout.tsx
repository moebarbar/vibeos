import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const { data: { user: supabaseUser } } = await supabase.auth.getUser();
  if (!supabaseUser) redirect("/sign-in");

  // Upsert user in our DB
  let user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        supabaseId: supabaseUser.id,
        email: supabaseUser.email ?? "",
        name: supabaseUser.user_metadata?.full_name ?? null,
      },
    });
  }

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  const activeProject = projects.find(p => p.isActive) ?? null;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const usageCount = await prisma.usageLog.count({
    where: { userId: user.id, createdAt: { gte: startOfMonth } },
  });

  return (
    <div style={{ display: "flex", height: "100vh", background: "#030305", color: "#fff", fontFamily: "system-ui,-apple-system,sans-serif", overflow: "hidden", position: "relative" }}>
      {/* Ambient glow behind sidebar */}
      <div style={{ position: "fixed", top: 0, left: 0, width: 300, height: "100vh", background: "radial-gradient(ellipse at 0% 50%, rgba(0,255,178,0.025) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <Sidebar
        user={{ id: user.id, name: user.name, email: user.email, plan: user.plan }}
        projects={projects}
        activeProject={activeProject}
        usageCount={usageCount}
      />
      <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
        {children}
      </main>
    </div>
  );
}
