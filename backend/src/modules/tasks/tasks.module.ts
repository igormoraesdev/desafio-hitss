import { Module } from '@nestjs/common';
import { TeamsModule } from '../teams/teams.module';
import { PrismaTasksRepository } from './repositories/prisma-tasks.repository';
import { TASKS_REPOSITORY } from './repositories/tasks.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [TeamsModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    { provide: TASKS_REPOSITORY, useClass: PrismaTasksRepository },
  ],
})
export class TasksModule {}
