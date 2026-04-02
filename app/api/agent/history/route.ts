import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) return new Response("projectId required", { status: 400 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("User not found", { status: 404 });

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) return new Response("Project not found", { status: 404 });

  const messages = await prisma.conversationMessage.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  return new Response(JSON.stringify({ messages }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) return new Response("projectId required", { status: 400 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("User not found", { status: 404 });

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) return new Response("Project not found", { status: 404 });

  await prisma.conversationMessage.deleteMany({ where: { projectId } });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
