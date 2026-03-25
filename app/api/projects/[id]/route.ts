import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";

async function getAuthedUser(supabaseId: string) {
  return prisma.user.findUnique({ where: { supabaseId } });
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });
  const user = await getAuthedUser(supabaseUser.id);
  if (!user) return new Response("Not found", { status: 404 });

  const project = await prisma.project.findFirst({
    where: { id: params.id, userId: user.id },
    include: { ledgerEntries: { orderBy: { createdAt: "desc" } } },
  });

  if (!project) return new Response("Not found", { status: 404 });
  return Response.json(project);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });
  const user = await getAuthedUser(supabaseUser.id);
  if (!user) return new Response("Not found", { status: 404 });

  const data = await req.json();
  await prisma.project.updateMany({
    where: { id: params.id, userId: user.id },
    data: {
      name: data.name,
      description: data.description,
      stack: data.stack,
      builtFeatures: data.builtFeatures,
      decisions: data.decisions,
      contextBrief: data.contextBrief,
    },
  });

  return Response.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });
  const user = await getAuthedUser(supabaseUser.id);
  if (!user) return new Response("Not found", { status: 404 });

  await prisma.project.deleteMany({ where: { id: params.id, userId: user.id } });
  return Response.json({ success: true });
}
