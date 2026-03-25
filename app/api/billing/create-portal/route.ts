import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";

export async function POST() {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user?.stripeCustomerId) {
    return Response.json({ error: "No billing account found" }, { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?tab=billing`,
  });

  return Response.json({ url: session.url });
}
