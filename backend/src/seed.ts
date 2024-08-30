import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');

  const teams = await prisma.teams.createMany({
    data: [
      { name: 'Time A' },
      { name: 'Time B' },
      { name: 'Time C' },
    ],
  });

  console.log('Times adicionados:', teams);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
