import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return new Response("Not found", { status: 404 });

  // Deactivate all, then activate target
  await prisma.project.updateMany({ where: { userId: user.id }, data: { isActive: false } });
  await prisma.project.updateMany({ where: { id: params.id, userId: user.id }, data: { isActive: true } });

  return Response.json({ success: true });
}
