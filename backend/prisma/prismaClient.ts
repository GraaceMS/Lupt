const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const newUser = await prisma.user.create({
            data: {
                email: 'example.email.com', // Corrigido para um formato de email válido
                name: 'John Doe',
            }
        });
        console.log('New user created:', newUser);
    } catch (e) {
        console.error('Error creating user:', e); // Log detalhado do erro
    } finally {
        await prisma.$disconnect(); // Garantir desconexão do Prisma
    }
}

main();
