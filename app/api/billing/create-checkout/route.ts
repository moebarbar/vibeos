import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { stripe, STRIPE_PRICES } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return new Response("User not found", { status: 404 });

  const { plan } = await req.json();
  const priceId = plan === "PRO" ? STRIPE_PRICES.PRO_MONTHLY : STRIPE_PRICES.FOUNDER_MONTHLY;

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id, clerkId: userId },
    });
    customerId = customer.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?tab=billing&success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?tab=billing`,
    metadata: { userId: user.id, plan },
  });

  return Response.json({ url: session.url });
}
