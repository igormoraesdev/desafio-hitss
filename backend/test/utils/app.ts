import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { configureApp } from 'src/app.setup';
import { PrismaService } from 'src/prisma/prisma.service';
import { App } from 'supertest/types';

export const E2E_PREFIX = 'e2e-';

export type TestApp = INestApplication<App>;

export async function createTestApp(): Promise<TestApp> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication<TestApp>();
  configureApp(app);
  await app.init();
  return app;
}

export async function cleanupTestData(app: TestApp): Promise<void> {
  const prisma = app.get(PrismaService);
  await prisma.tasks.deleteMany({
    where: { title: { startsWith: E2E_PREFIX } },
  });
  await prisma.teams.deleteMany({
    where: { name: { startsWith: E2E_PREFIX } },
  });
}

let counter = 0;

export function uniqueName(label: string): string {
  counter += 1;
  return `${E2E_PREFIX}${label}-${Date.now()}-${counter}`;
}
