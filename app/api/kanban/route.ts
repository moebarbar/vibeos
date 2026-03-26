import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return Response.json([]);

  const projectId = req.nextUrl.searchParams.get("projectId");
  if (!projectId) return Response.json([]);

  const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } });
  if (!project) return new Response("Project not found", { status: 404 });

  const cards = await prisma.kanbanCard.findMany({
    where: { projectId },
    orderBy: [{ column: "asc" }, { position: "asc" }],
  });

  return Response.json(cards);
}

export async function POST(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("Not found", { status: 404 });

  const { projectId, title, description, column = "plan", aiPrompt, tags } = await req.json();
  if (!projectId || !title) return new Response("Missing required fields", { status: 400 });

  const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } });
  if (!project) return new Response("Project not found", { status: 404 });

  // Auto-assign position at end of the column
  const count = await prisma.kanbanCard.count({ where: { projectId, column } });

  const card = await prisma.kanbanCard.create({
    data: { projectId, title, description, column, position: count, aiPrompt, tags },
  });

  return Response.json(card, { status: 201 });
}
