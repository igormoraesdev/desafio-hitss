import { ApiProperty } from '@nestjs/swagger';
import { Tasks } from 'src/generated/prisma/client';
import { Status } from 'src/generated/prisma/enums';
import { TeamDto } from '../../teams/dto/team.dto';

export class TaskDto implements Tasks {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Integrar app com a API' })
  title: string;

  @ApiProperty({
    nullable: true,
    type: String,
    example: 'Cliente HTTP e tratamento do envelope de resposta',
  })
  description: string | null;

  @ApiProperty({ enum: Status, example: Status.IN_PROGRESS })
  status: Status;

  @ApiProperty({
    type: [TeamDto],
    description: 'Times vinculados. Pode ser vazio.',
  })
  teams: TeamDto[];

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
