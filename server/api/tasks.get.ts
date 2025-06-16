import prisma from "@/lib/prisma";

export default defineEventHandler(async () => {
	const tasks = await prisma.task.findMany();
	return tasks;
});
