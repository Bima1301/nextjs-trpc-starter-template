import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";

import {
    listInputSchema,
    postCreateSchema,
    postIdSchema,
    postUpdateSchema,
} from "./schema";


export const postRouter = createTRPCRouter({
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),

    list: protectedProcedure
        .input(listInputSchema.partial())
        .query(async ({ ctx, input }) => {
            const page = input.page ?? 1;
            const limit = input.limit ?? 10;
            const search = input.search ?? "";

            const where = {
                createdById: ctx.session.user.id,
                ...(search
                    ? {
                        name: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    }
                    : {}),
            };

            const [items, total] = await Promise.all([
                ctx.db.post.findMany({
                    where,
                    orderBy: { createdAt: "desc" },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                ctx.db.post.count({ where }),
            ]);

            return {
                items,
                total,
                page,
                limit,
            };
        }),

    create: protectedProcedure
        .input(postCreateSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.post.create({
                data: {
                    name: input.name,
                    createdBy: { connect: { id: ctx.session.user.id } },
                },
            });
        }),

    update: protectedProcedure
        .input(postUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            const { id, name } = input;
            return ctx.db.post.update({
                where: {
                    id,
                    createdById: ctx.session.user.id,
                },
                data: { name },
            });
        }),

    delete: protectedProcedure
        .input(postIdSchema)
        .mutation(async ({ ctx, input }) => {
            await ctx.db.post.delete({
                where: {
                    id: input.id,
                    createdById: ctx.session.user.id,
                },
            });
            return { success: true };
        }),

    getLatest: protectedProcedure.query(async ({ ctx }) => {
        const post = await ctx.db.post.findFirst({
            orderBy: { createdAt: "desc" },
            where: { createdBy: { id: ctx.session.user.id } },
        });

        return post ?? null;
    }),

    getSecretMessage: protectedProcedure.query(() => {
        return "you can now see this secret message!";
    }),
});

export * from "./schema";

