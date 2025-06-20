import { z } from "zod";
import prisma from "@/lib/prisma";

const IdParamsSchema = z.object({
	id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
	const result = await getValidatedRouterParams(event, IdParamsSchema.safeParse);

	if (!result.success) {
		return sendError(event, createError({
			statusCode: 422,
			statusMessage: "Invalid task ID",
		}));
	}

	const task = await prisma.task.findFirst({
		where: { id: result.data.id },
	});

	if (!task) {
		return sendError(event, createError({
			statusCode: 404,
			statusMessage: "Task not found",
		}));
	}

	return task;
});
