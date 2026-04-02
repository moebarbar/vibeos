import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("User not found", { status: 404 });

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = await prisma.notification.count({
    where: { userId: user.id, isRead: false },
  });

  return new Response(JSON.stringify({ notifications, unreadCount }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function PATCH(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const { notificationId, markAllRead } = await req.json();

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("User not found", { status: 404 });

  if (markAllRead) {
    await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  }

  if (notificationId) {
    await prisma.notification.updateMany({
      where: { id: notificationId, userId: user.id },
      data: { isRead: true },
    });
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  }

  return new Response("notificationId or markAllRead required", { status: 400 });
}
