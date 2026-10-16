import { Module } from '@nestjs/common';
import { PrismaTeamsRepository } from './repositories/prisma-teams.repository';
import { TEAMS_REPOSITORY } from './repositories/teams.repository';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
  controllers: [TeamsController],
  providers: [
    TeamsService,
    { provide: TEAMS_REPOSITORY, useClass: PrismaTeamsRepository },
  ],
})
export class TeamsModule {}
