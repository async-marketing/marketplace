import { buffer } from "micro";
import Stripe from "stripe";
import { env } from "~/env";
import { db } from "~/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

const webhookSecret = env.STRIPE_CONNECT_WEBHOOK_KEY;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const requestBuffer = await buffer(request);
    const sig = request.headers["stripe-signature"]!;

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });

    const event = stripe.webhooks.constructEvent(
      requestBuffer.toString(),
      sig,
      webhookSecret,
    );

    let accountId;
    if (typeof event.account !== "undefined") {
      const account = await db.account.findFirst({
        where: {
          stripeId: event.account,
        },
      });

      if (account) {
        accountId = account.id;
      }
    }
    await db.event.create({
      data: {
        accountId,
        source: event.type,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        data: event.data.object as any,
      },
    });

    response.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    response.status(500).end();
  }
}
