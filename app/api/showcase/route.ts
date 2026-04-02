import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const industry = searchParams.get("industry");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = 24;

  const where = {
    isPublic: true,
    ...(industry ? { industryTag: industry } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.communityShowcase.findMany({
      where,
      orderBy: { likes: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        project: {
          select: { name: true, description: true, industry: true },
        },
      },
    }),
    prisma.communityShowcase.count({ where }),
  ]);

  return new Response(JSON.stringify({ items, total, page, pages: Math.ceil(total / limit) }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const { projectId, headline, demoUrl, isPublic } = await req.json();
  if (!projectId || !headline) return new Response("projectId and headline required", { status: 400 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("User not found", { status: 404 });

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) return new Response("Project not found", { status: 404 });

  const showcase = await prisma.communityShowcase.upsert({
    where: { projectId },
    create: {
      projectId,
      userId: user.id,
      headline,
      demoUrl: demoUrl ?? null,
      isPublic: isPublic ?? false,
      industryTag: project.industry ?? null,
    },
    update: {
      headline,
      demoUrl: demoUrl ?? null,
      isPublic: isPublic ?? false,
    },
  });

  return new Response(JSON.stringify({ showcase }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function PATCH(req: NextRequest) {
  // Like a showcase item
  const { showcaseId } = await req.json();
  if (!showcaseId) return new Response("showcaseId required", { status: 400 });

  await prisma.communityShowcase.update({
    where: { id: showcaseId },
    data: { likes: { increment: 1 } },
  });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
