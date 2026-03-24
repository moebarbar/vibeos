import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new Response(`Webhook error: ${err}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan;
      if (userId && plan) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: plan as any,
            stripeSubscriptionId: session.subscription,
          },
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as any;
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { plan: "FREE", stripeSubscriptionId: null },
      });
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as any;
      const priceId = sub.items?.data?.[0]?.price?.id;
      if (priceId) {
        const plan =
          priceId === process.env.STRIPE_PRO_PRICE_ID ? "PRO" :
          priceId === process.env.STRIPE_FOUNDER_PRICE_ID ? "FOUNDER" : "FREE";
        await prisma.user.updateMany({
          where: { stripeCustomerId: sub.customer },
          data: { plan: plan as any },
        });
      }
      break;
    }
  }

  return Response.json({ received: true });
}
