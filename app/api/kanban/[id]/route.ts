import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("Not found", { status: 404 });

  const card = await prisma.kanbanCard.findFirst({
    where: { id: params.id, project: { userId: user.id } },
  });
  if (!card) return new Response("Card not found", { status: 404 });

  const { title, description, column, position, aiPrompt, tags } = await req.json();

  const updated = await prisma.kanbanCard.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(column !== undefined && { column }),
      ...(position !== undefined && { position }),
      ...(aiPrompt !== undefined && { aiPrompt }),
      ...(tags !== undefined && { tags }),
    },
  });

  return Response.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("Not found", { status: 404 });

  const card = await prisma.kanbanCard.findFirst({
    where: { id: params.id, project: { userId: user.id } },
  });
  if (!card) return new Response("Card not found", { status: 404 });

  await prisma.kanbanCard.delete({ where: { id: params.id } });

  return new Response(null, { status: 204 });
}
