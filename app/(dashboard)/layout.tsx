import type { ReactNode } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/layout/Sidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();

  // Upsert user in our DB
  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
        name: clerkUser?.firstName ? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`.trim() : null,
      },
    });
  }

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  const activeProject = projects.find(p => p.isActive) ?? null;

  // Usage this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const usageCount = await prisma.usageLog.count({
    where: { userId: user.id, createdAt: { gte: startOfMonth } },
  });

  return (
    <div style={{ display: "flex", height: "100vh", background: "#070707", color: "#fff", fontFamily: "system-ui, sans-serif", overflow: "hidden" }}>
      <Sidebar
        user={{ id: user.id, name: user.name, email: user.email, plan: user.plan }}
        projects={projects}
        activeProject={activeProject}
        usageCount={usageCount}
      />
      <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </div>
  );
}
