import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";

export async function GET() {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return Response.json(null);

  const project = await prisma.project.findFirst({
    where: { userId: user.id, isActive: true },
  });

  return Response.json(project);
}
