import { Client, Employee, PrismaClient, Role, ScheduleStatus } from '@prisma/client';

const prisma = new PrismaClient();

// ==== PARÂMETROS DE CONTROLE ====
const NUM_BARBERSHOPS = 4;
const NUM_EMPLOYEES_PER_SHOP = 3;
const NUM_CLIENTS_PER_SHOP = 5;
const NUM_SCHEDULINGS_PER_SHOP = 6;

// ==== FUNÇÕES DE GERAR DADOS ====
function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randDateFuture(): Date {
  const today = new Date();
  today.setDate(today.getDate() + randNumber(1, 30));
  today.setHours(randNumber(9, 17), 0, 0, 0);
  return today;
}

function gerarNome(): string {
  const nomes = [
    'João',
    'Lucas',
    'Pedro',
    'Ana',
    'Carlos',
    'Paulo',
    'Rafael',
    'Marcos',
    'Felipe',
    'Gustavo',
  ];
  const sobrenomes = [
    'Silva',
    'Santos',
    'Oliveira',
    'Souza',
    'Pereira',
    'Lima',
    'Rodrigues',
    'Almeida',
  ];
  return `${rand(nomes)} ${rand(sobrenomes)}`;
}

function gerarTelefone(): string {
  return `11${randNumber(90000, 99999)}${randNumber(1000, 9999)}`;
}

function gerarEmail(nome: string): string {
  return (
    nome.toLowerCase().replace(/ /g, '.') + randNumber(100, 999) + '@email.com'
  );
}

function gerarSenha(): string {
  return '123456';
}

function gerarNumero(): string {
  return randNumber(1, 9999).toString();
}

function gerarCep(): string {
  return `${randNumber(10000, 99999)}-${randNumber(100, 999)}`;
}

function gerarEstado(): string {
  const estados = ['SP', 'RJ', 'MG', 'RS', 'SC', 'PR', 'BA', 'PE', 'CE', 'GO'];
  return rand(estados);
}

function gerarCidade(): string {
  const cidades = [
    'São Paulo',
    'Rio de Janeiro',
    'Belo Horizonte',
    'Porto Alegre',
    'Curitiba',
    'Recife',
    'Fortaleza',
    'Goiânia',
    'Campinas',
    'Salvador',
  ];
  return rand(cidades);
}

function gerarBairro(): string {
  const bairros = [
    'Centro',
    'Jardins',
    'Copacabana',
    'Savassi',
    'Boa Viagem',
    'Aclimação',
    'Moema',
  ];
  return rand(bairros);
}

function gerarRua(): string {
  const ruas = [
    'Rua das Flores',
    'Avenida Paulista',
    'Rua do Comércio',
    'Travessa da Paz',
    'Rua das Palmeiras',
  ];
  return rand(ruas);
}

function gerarComplemento(): string {
  const complementos = ['Sala 1', 'Apto 203', 'Fundos', 'Loja 5', 'Bloco B'];
  return rand(complementos);
}

// ==== SEED PRINCIPAL ====
async function seedDatabase() {
  try {
    const imagens = [
      'https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png',
      'https://utfs.io/f/45331760-899c-4b4b-910e-e00babb6ed81-16q.png',
      'https://utfs.io/f/5832df58-cfd7-4b3f-b102-42b7e150ced2-16r.png',
      'https://utfs.io/f/7e309eaa-d722-465b-b8b6-76217404a3d3-16s.png',
    ];

    const nomesBarbearias = [
      'Barbearia Clássica',
      'Corte Fino',
      'Estilo Jovem',
      'Navalha Brava',
      'Tesoura de Ouro',
      'Barber King',
      'Senhor Corte',
      'Bigode Fino',
    ];

    const servicosPadrao = [
      { name: 'Corte', description: 'Corte padrão masculino', price: 50 },
      { name: 'Barba', description: 'Aparar e modelar a barba', price: 35 },
      {
        name: 'Sobrancelha',
        description: 'Modelagem com pinça ou navalha',
        price: 20,
      },
    ];

    for (let i = 0; i < NUM_BARBERSHOPS; i++) {
      const nome = nomesBarbearias[i % nomesBarbearias.length];
      const imagem = imagens[i % imagens.length];

      const address = await prisma.addressBarbershop.create({
        data: {
          number: gerarNumero(),
          street: gerarRua(),
          complement: gerarComplemento(),
          neighborhood: gerarBairro(),
          city: gerarCidade(),
          state: gerarEstado(),
          country: 'Brasil',
          zipCode: gerarCep(),
        },
      });

      const barbershop = await prisma.barbershop.create({
        data: {
          name: nome,
          imageUrl: imagem,
          timeOpen: '09:00',
          timeClose: '18:00',
          addressId: address.id,
        },
      });

      for (const s of servicosPadrao) {
        await prisma.services.create({
          data: {
            name: s.name,
            description: s.description,
            price: s.price,
            barbershopId: barbershop.id,
          },
        });
      }

      // FUNCIONÁRIOS
      const employees: Employee[] = [];
      for (let j = 0; j < NUM_EMPLOYEES_PER_SHOP; j++) {
        const nome = gerarNome();
        const employee = await prisma.employee.create({
          data: {
            name: nome,
            birth: new Date('1990-01-01'),
            phone: gerarTelefone(),
            email: gerarEmail(nome),
            password: gerarSenha(),
            role: Role.EMPLOYEE,
            barbershopId: barbershop.id,
          },
        });
        employees.push(employee);
      }

      // CLIENTES
      const clients: Client[] = [];
      for (let j = 0; j < NUM_CLIENTS_PER_SHOP; j++) {
        const nome = gerarNome();
        const client = await prisma.client.create({
          data: {
            name: nome,
            birth: new Date('2000-01-01'),
            phone: gerarTelefone(),
            email: gerarEmail(nome),
            password: gerarSenha(),
          },
        });
        clients.push(client);
      }

      const services = await prisma.services.findMany({
        where: { barbershopId: barbershop.id },
      });

      // AGENDAMENTOS
      for (let j = 0; j < NUM_SCHEDULINGS_PER_SHOP; j++) {
        const cliente = rand(clients);
        const funcionario = rand(employees);
        const statusValues = Object.values(ScheduleStatus) as ScheduleStatus[];
        const status = rand(statusValues);
        const shuffled = services.sort(() => 0.5 - Math.random());
        const servicosEscolhidos = shuffled.slice(0, 2);
        const total = servicosEscolhidos.reduce(
          (acc, s) => acc + Number(s.price),
          0,
        );


        const agendamento = await prisma.scheduling.create({
          data: {
            barbershopId: barbershop.id,
            clientId: cliente.id,
            employeeId: funcionario.id,
            status: status,
            dateTime: randDateFuture(),
            priceTotal: total,
          },
        });

        for (const s of servicosEscolhidos) {
          await prisma.servicesOnScheduling.create({
            data: {
              schedulingId: agendamento.id,
              serviceId: s.id,
            },
          });
        }
      }
    }

    console.log('✅ Seed completa com parâmetros finalizada.');
  } catch (error) {
    console.error('❌ Erro ao executar a seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

void seedDatabase();
