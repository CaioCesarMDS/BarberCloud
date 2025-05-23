/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Cria um usuário
  const user = await prisma.user.create({
    data: {
      name: 'Caio Silva',
    },
  });

  // Cria uma barbearia com alguns serviços
  const barbershop = await prisma.barbershop.create({
    data: {
      name: 'Barbearia Estilo Fino',
      address: 'Rua das Flores, 123 - Centro',
      imageUrl: 'https://example.com/imagem-barbearia.jpg',
      services: {
        create: [
          {
            name: 'Corte Tradicional',
            price: 30.0,
            description: 'Corte de cabelo com tesoura e máquina.',
          },
          {
            name: 'Barba Completa',
            price: 25.0,
            description: 'Modelagem e aparo de barba com toalha quente.',
          },
          {
            name: 'Combo Corte + Barba',
            price: 50.0,
            description: 'Pacote promocional de corte e barba.',
          },
        ],
      },
    },
  });

  console.log('Seed finalizada com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
