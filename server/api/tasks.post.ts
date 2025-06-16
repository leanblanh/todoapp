import {z} from 'zod'
import prisma from "~/lib/prisma"

const InsertTasksSchema = z.object({
    title : z.string().min(1, "O título da Tarefa é Obrigatório"),
})

export default defineEventHandler(async (event)=>{
    let validatedData
    try{

        validatedData = await readValidatedBody(event, InsertTasksSchema.parse)
    }catch(validationError: any){
        return sendError(event, createError({
            statusCode: 422,
            message: validationError.message || "Dados de tarefa inválidos"
        }))
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
    } catch (dbError: any) {
        // Lida com erros do banco de dados (Prisma)
        console.error("Erro ao criar tarefa no banco de dados:", dbError);
        return sendError(event, createError({
        statusCode: 500,
        statusMessage: "Erro interno do servidor ao criar a tarefa.",
        }));
  } finally {
    // Opcional: desconectar o Prisma client se não for uma instância global reutilizada
    // Se você tiver uma estratégia de instanciar o PrismaClient uma vez e reutilizar,
    // não precisa do disconnect aqui.
    // await prisma.$disconnect();
  }
})