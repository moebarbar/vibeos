import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return Response.json(null);

  const project = await prisma.project.findFirst({
    where: { userId: user.id, isActive: true },
  });

  return Response.json(project);
}
