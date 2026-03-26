import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("Not found", { status: 404 });

  const { cards } = await req.json() as { cards: { id: string; column: string; position: number }[] };
  if (!Array.isArray(cards)) return new Response("Invalid payload", { status: 400 });

  // Batch update using transaction
  await prisma.$transaction(
    cards.map(({ id, column, position }) =>
      prisma.kanbanCard.updateMany({
        where: { id, project: { userId: user.id } },
        data: { column, position },
      })
    )
  );

  return new Response(null, { status: 204 });
}
