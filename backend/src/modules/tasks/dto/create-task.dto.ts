import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { trim } from 'src/common/utils/string';
import { Status } from 'src/generated/prisma/enums';

const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título da tarefa. Espaços nas pontas são removidos.',
    minLength: TITLE_MIN_LENGTH,
    maxLength: TITLE_MAX_LENGTH,
    example: 'Integrar app com a API',
  })
  @Transform(trim)
  @IsString({ message: 'title precisa ser do tipo string' })
  @IsNotEmpty({ message: 'title é obrigatório' })
  @MinLength(TITLE_MIN_LENGTH, {
    message: `title precisa ter ao menos ${TITLE_MIN_LENGTH} caracteres`,
  })
  @MaxLength(TITLE_MAX_LENGTH, {
    message: `title precisa ter no máximo ${TITLE_MAX_LENGTH} caracteres`,
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição livre.',
    maxLength: DESCRIPTION_MAX_LENGTH,
    example: 'Cliente HTTP e tratamento do envelope de resposta',
  })
  @IsOptional()
  @Transform(trim)
  @IsString({ message: 'description precisa ser do tipo string' })
  @MaxLength(DESCRIPTION_MAX_LENGTH, {
    message: `description precisa ter no máximo ${DESCRIPTION_MAX_LENGTH} caracteres`,
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Status inicial. Quando omitido, a tarefa nasce como PENDING.',
    enum: Status,
    default: Status.PENDING,
  })
  @IsOptional()
  @IsEnum(Status, {
    message: `status precisa ser um de: ${Object.values(Status).join(', ')}`,
  })
  status?: Status;

  @ApiPropertyOptional({
    description:
      'Ids dos times vinculados. Todos precisam existir; na atualização a lista substitui a atual, e [] desvincula todos.',
    type: [Number],
    example: [1, 2],
  })
  @IsOptional()
  @IsArray({ message: 'teamIds precisa ser uma lista' })
  @ArrayUnique({ message: 'teamIds não pode ter ids repetidos' })
  @IsInt({ each: true, message: 'teamIds precisa conter apenas inteiros' })
  @IsPositive({ each: true, message: 'teamIds precisa conter ids positivos' })
  teamIds?: number[];
}
