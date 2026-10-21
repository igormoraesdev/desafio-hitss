import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Status } from '../src/generated/prisma/client';

interface TeamSeed {
  name: string;
  color: string;
}

interface TaskSeed {
  title: string;
  description?: string;
  status: Status;
  teams: string[];
}

const teams: TeamSeed[] = [
  { name: 'Frontend', color: '#3b82f6' },
  { name: 'Backend', color: '#22c55e' },
  { name: 'QA', color: '#f59e0b' },
];

const tasks: TaskSeed[] = [
  {
    title: 'Configurar ambiente local',
    description: 'Docker Compose com Postgres e variáveis de ambiente',
    status: Status.COMPLETED,
    teams: ['Backend'],
  },
  {
    title: 'Modelar times e tarefas',
    description: 'Relação N:N entre teams e tasks no Prisma',
    status: Status.COMPLETED,
    teams: ['Backend'],
  },
  {
    title: 'Criar tela de listagem de tarefas',
    description: 'Lista com filtros por status, time e busca',
    status: Status.IN_PROGRESS,
    teams: ['Frontend'],
  },
  {
    title: 'Integrar app com a API',
    description: 'Cliente HTTP e tratamento do envelope de resposta',
    status: Status.IN_PROGRESS,
    teams: ['Frontend', 'Backend'],
  },
  {
    title: 'Escrever testes e2e',
    status: Status.PENDING,
    teams: ['Backend', 'QA'],
  },
  {
    title: 'Revisar acessibilidade das telas',
    status: Status.PENDING,
    teams: ['Frontend', 'QA'],
  },
  {
    title: 'Documentar decisões no README',
    status: Status.PENDING,
    teams: [],
  },
  {
    title: 'Publicar build de homologação',
    description: 'Gerar o build e distribuir para o time de testes',
    status: Status.COMPLETED,
    teams: ['QA'],
  },
  {
    title: 'Adicionar filtro por time na lista',
    description: 'Chip com a cor do time e filtro na listagem global',
    status: Status.IN_PROGRESS,
    teams: ['Frontend', 'Backend'],
  },
  {
    title: 'Configurar CI com lint e testes',
    status: Status.PENDING,
    teams: [],
  },
];

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function seedTeams(): Promise<Map<string, number>> {
  const ids = new Map<string, number>();
  for (const team of teams) {
    const saved = await prisma.teams.upsert({
      where: { name: team.name },
      update: { color: team.color },
      create: team,
    });
    ids.set(saved.name, saved.id);
  }
  return ids;
}

async function seedTasks(teamIds: Map<string, number>): Promise<void> {
  for (const { teams: teamNames, ...task } of tasks) {
    const teamRefs = teamNames.map((name) => {
      const id = teamIds.get(name);
      if (id === undefined) {
        throw new Error(`Time "${name}" não existe no seed`);
      }
      return { id };
    });
    const existing = await prisma.tasks.findFirst({
      where: { title: task.title },
    });
    if (existing) {
      await prisma.tasks.update({
        where: { id: existing.id },
        data: { ...task, teams: { set: teamRefs } },
      });
    } else {
      await prisma.tasks.create({
        data: { ...task, teams: { connect: teamRefs } },
      });
    }
  }
}

async function main(): Promise<void> {
  const teamIds = await seedTeams();
  await seedTasks(teamIds);
  console.log(`Seed concluído: ${teams.length} times, ${tasks.length} tasks`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
