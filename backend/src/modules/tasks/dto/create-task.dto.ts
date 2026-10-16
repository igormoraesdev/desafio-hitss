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
} from 'class-validator';
import { trim } from 'src/common/utils/string';
import { Status } from 'src/generated/prisma/enums';

const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

export class CreateTaskDto {
  @Transform(trim)
  @IsString({ message: 'title precisa ser do tipo string' })
  @IsNotEmpty({ message: 'title é obrigatório' })
  @MaxLength(TITLE_MAX_LENGTH, {
    message: `title precisa ter no máximo ${TITLE_MAX_LENGTH} caracteres`,
  })
  title: string;

  @IsOptional()
  @Transform(trim)
  @IsString({ message: 'description precisa ser do tipo string' })
  @MaxLength(DESCRIPTION_MAX_LENGTH, {
    message: `description precisa ter no máximo ${DESCRIPTION_MAX_LENGTH} caracteres`,
  })
  description?: string;

  @IsOptional()
  @IsEnum(Status, {
    message: `status precisa ser um de: ${Object.values(Status).join(', ')}`,
  })
  status?: Status;

  @IsOptional()
  @IsArray({ message: 'teamIds precisa ser uma lista' })
  @ArrayUnique({ message: 'teamIds não pode ter ids repetidos' })
  @IsInt({ each: true, message: 'teamIds precisa conter apenas inteiros' })
  @IsPositive({ each: true, message: 'teamIds precisa conter ids positivos' })
  teamIds?: number[];
}
