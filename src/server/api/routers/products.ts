import { z } from "zod";
import Stripe from "stripe";
import { env } from "~/env";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getBaseUrl } from "~/utils/api";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const productsRouter = createTRPCRouter({
  purchaseProduct: publicProcedure
    .input(
      z.object({
        productPriceId: z.string(),
        price: z.string(),
        stripeAccountId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      // calculate 10% fee amount for platform
      const feeAmount = (parseFloat(input.price) * 100 * 10) / 100;
      const checkoutSession = await stripe.checkout.sessions.create(
        {
          mode: "payment",
          line_items: [{ price: input.productPriceId, quantity: 1 }],
          payment_intent_data: {
            application_fee_amount: feeAmount,
          },
          success_url: `${getBaseUrl()}/checkout`,
        },
        {
          stripeAccount: input.stripeAccountId,
        },
      );

      return checkoutSession.url;
    }),
  getAllByStore: publicProcedure
    .input(z.object({ storeId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findMany({
        where: {
          storeId: input.storeId,
        },
        take: 100,
        orderBy: { name: "asc" },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        storeId: z.number(),
        stripeAccountId: z.string(),
        price: z.number(),
        data: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const stripeProduct = await stripe.products.create(
        {
          name: input.name,
          metadata: {
            store_id: input.storeId,
          },
          default_price_data: {
            currency: "USD",
            unit_amount: input.price * 100,
          },
          expand: ["default_price"],
        },
        {
          stripeAccount: input.stripeAccountId,
        },
      );

      return ctx.db.product.create({
        data: {
          name: input.name,
          price: input.price.toString(),
          stripeId: stripeProduct.id,
          stripePriceId: (stripeProduct.default_price as Stripe.Price).id,
          storeId: input.storeId,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
          data: stripeProduct as any,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        storeId: z.number(),
        stripeId: z.string(),
        stripePriceId: z.string(),
        price: z.number(),
        data: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = input.id;

      return ctx.db.product.update({
        where: {
          id,
        },
        data: {
          name: input.name,
          stripeId: input.stripeId,
          stripePriceId: input.stripePriceId,
          price: input.price.toString(),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: input.data,
          updatedAt: new Date(),
        },
      });
    }),
});
