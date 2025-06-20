import { z } from "zod";
import prisma from "~/lib/prisma";

const InsertTasksSchema = z.object({
	title: z.string().min(1, "O título da Tarefa é Obrigatório"),
});

export default defineEventHandler(async (event) => {
	let validatedData;
	try {
		validatedData = await readValidatedBody(event, InsertTasksSchema.parse);
	}
	catch (validationError: unknown) {
		let message = "Dados de tarefa inválidos";
		if (validationError instanceof Error) {
			message = validationError.message || message;
		}
		return sendError(event, createError({
			statusCode: 422,
			message,
		}));
	}

	try {
		// Usar Prisma para criar a nova task
		const newTask = await prisma.task.create({
			data: {
				title: validatedData.title,
				// Inclua outros campos aqui conforme seu schema Prisma e dados validados
			},
		});

		// Retorna a tarefa criada
		return { task: newTask };
	}
	catch (dbError: unknown) {
		// Lida com erros do banco de dados (Prisma)
		console.error("Erro ao criar tarefa no banco de dados:", dbError);
		let message = "Erro ao criar a tarefa no banco de dados";
		if (dbError instanceof Error) {
			message = dbError.message || message;
		}

		return sendError(event, createError({
			statusCode: 500,
			statusMessage: message,
		}));
	}
	finally {
		// Opcional: desconectar o Prisma client se não for uma instância global reutilizada
		// Se você tiver uma estratégia de instanciar o PrismaClient uma vez e reutilizar,
		// não precisa do disconnect aqui.
		// await prisma.$disconnect();
	}
});
