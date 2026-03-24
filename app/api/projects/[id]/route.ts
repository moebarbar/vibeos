import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

async function getAuthedUser(userId: string) {
  return prisma.user.findUnique({ where: { clerkId: userId } });
}

// GET /api/projects/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const user = await getAuthedUser(userId);
  if (!user) return new Response("Not found", { status: 404 });

  const project = await prisma.project.findFirst({
    where: { id: params.id, userId: user.id },
    include: { ledgerEntries: { orderBy: { createdAt: "desc" } } },
  });

  if (!project) return new Response("Not found", { status: 404 });
  return Response.json(project);
}

// PUT /api/projects/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const user = await getAuthedUser(userId);
  if (!user) return new Response("Not found", { status: 404 });

  const data = await req.json();
  const project = await prisma.project.updateMany({
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

// DELETE /api/projects/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const user = await getAuthedUser(userId);
  if (!user) return new Response("Not found", { status: 404 });

  await prisma.project.deleteMany({ where: { id: params.id, userId: user.id } });
  return Response.json({ success: true });
}
