import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return Response.json([]);

  const projectId = req.nextUrl.searchParams.get("projectId");

  const entries = await prisma.ledgerEntry.findMany({
    where: projectId
      ? { projectId, project: { userId: user.id } }
      : { project: { userId: user.id } },
    orderBy: { createdAt: "desc" },
    include: { project: { select: { name: true } } },
  });

  return Response.json(entries);
}

export async function POST(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("Not found", { status: 404 });

  const { projectId, type, summary, details, impact, refSnippet } = await req.json();

  const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } });
  if (!project) return new Response("Project not found", { status: 404 });

  const entry = await prisma.ledgerEntry.create({
    data: { projectId, type, summary, details, impact, refSnippet },
  });

  return Response.json(entry, { status: 201 });
}
