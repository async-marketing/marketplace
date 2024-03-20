import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const storesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.store.findMany({
      take: 100,
      orderBy: { name: "asc" },
    });
  }),

  get: publicProcedure
    .input(z.object({ storeId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.store.findFirst({
        where: {
          id: input.storeId,
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.store.create({
        data: {
          ...input,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = input.id;

      return ctx.db.store.update({
        where: {
          id,
        },
        data: {
          name: input.name,
          description: input.description,
          updatedAt: new Date(),
        },
      });
    }),
});
