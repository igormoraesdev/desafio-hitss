import { ApiProperty } from '@nestjs/swagger';
import { Teams } from 'src/generated/prisma/client';

export class TeamDto implements Teams {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Frontend' })
  name: string;

  @ApiProperty({ example: '#3b82f6' })
  color: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
