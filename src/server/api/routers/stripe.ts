import { z } from "zod";
import Stripe from "stripe";
import { getBaseUrl } from "~/utils/api";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { env } from "~/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const stripeRouter = createTRPCRouter({
  createAccount: protectedProcedure
    .input(
      z.object({ email: z.string(), userId: z.number(), storeId: z.number() }),
    )
    .mutation(async ({ ctx, input }) => {
      const stripeAccount = await stripe.accounts.create({
        type: "express",
        country: "US",
        email: input.email,
        business_type: "company",
        capabilities: {
          card_payments: {
            requested: true,
          },
          transfers: {
            requested: true,
          },
        },
      });

      const account = await ctx.db.account.create({
        data: {
          chargesEnabled: true,
          email: input.email,
          payoutsEnabled: true,
          stripeId: stripeAccount.id,
          userId: input.userId,
        },
      });

      await ctx.db.store.update({
        where: {
          id: input.storeId,
        },
        data: {
          accountId: account.id,
        },
      });

      return account;
    }),

  getOnboardingUrl: protectedProcedure
    .input(z.object({ stripeAccountId: z.string(), storeId: z.number() }))
    .mutation(async ({ input }) => {
      const url = (
        await stripe.accountLinks.create({
          account: input.stripeAccountId,
          refresh_url: `${getBaseUrl()}/store/${input.storeId}`,
          return_url: `${getBaseUrl()}/store/${input.storeId}`,
          type: "account_onboarding",
          collect: "eventually_due",
        })
      ).url;
      return url;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        accountId: z.number(),
        userId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.store.create({
        data: {
          ...input,
        },
      });
    }),

  getAccount: publicProcedure
    .input(z.object({ id: z.number().optional().nullable() }))
    .query(async ({ ctx, input }) => {
      if (!input.id) {
        return null;
      }

      const id = input.id;

      return ctx.db.account.findFirst({
        where: {
          id,
        },
      });
    }),
});
