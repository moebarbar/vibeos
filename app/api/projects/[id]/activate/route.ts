import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("Not found", { status: 404 });

  await prisma.project.updateMany({ where: { userId: user.id }, data: { isActive: false } });
  await prisma.project.updateMany({ where: { id: params.id, userId: user.id }, data: { isActive: true } });

  return Response.json({ success: true });
}
