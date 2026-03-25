import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";

export async function GET() {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return Response.json([]);

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { ledgerEntries: true } } },
  });

  return Response.json(projects);
}

export async function POST(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("User not found", { status: 404 });

  if (user.plan === "FREE") {
    const count = await prisma.project.count({ where: { userId: user.id } });
    if (count >= 1) {
      return Response.json({ error: "Free plan allows 1 project. Upgrade to Pro for unlimited projects." }, { status: 403 });
    }
  }

  const { name, description, stack } = await req.json();
  if (!name?.trim()) return Response.json({ error: "Name required" }, { status: 400 });

  await prisma.project.updateMany({ where: { userId: user.id }, data: { isActive: false } });

  const project = await prisma.project.create({
    data: { userId: user.id, name: name.trim(), description: description?.trim() ?? "", stack: stack?.trim() ?? null, isActive: true },
  });

  return Response.json(project, { status: 201 });
}
