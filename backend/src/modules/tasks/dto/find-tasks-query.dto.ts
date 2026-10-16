import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { trim } from 'src/common/utils/string';
import { Status } from 'src/generated/prisma/enums';
import {
  SORT_ORDERS,
  SortOrder,
  TASK_SORT_FIELDS,
  TaskFilters,
  TaskSort,
  TaskSortField,
} from '../task-filters';

const SEARCH_MAX_LENGTH = 100;

export class FindTasksQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filtra pelo status.', enum: Status })
  @IsOptional()
  @IsEnum(Status, {
    message: `status precisa ser um de: ${Object.values(Status).join(', ')}`,
  })
  status?: Status;

  @ApiPropertyOptional({
    description: 'Filtra tarefas vinculadas ao time informado.',
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'teamId precisa ser um inteiro' })
  @IsPositive({ message: 'teamId precisa ser positivo' })
  teamId?: number;

  @ApiPropertyOptional({
    description: 'Busca por trecho do título, sem diferenciar maiúsculas.',
    maxLength: SEARCH_MAX_LENGTH,
    example: 'api',
  })
  @IsOptional()
  @Transform(trim)
  @IsString({ message: 'search precisa ser do tipo string' })
  @MaxLength(SEARCH_MAX_LENGTH, {
    message: `search precisa ter no máximo ${SEARCH_MAX_LENGTH} caracteres`,
  })
  search?: string;

  @ApiPropertyOptional({
    description: 'Campo de ordenação.',
    enum: TASK_SORT_FIELDS,
    default: 'createdAt',
  })
  @IsOptional()
  @IsIn(TASK_SORT_FIELDS, {
    message: `sortBy precisa ser um de: ${TASK_SORT_FIELDS.join(', ')}`,
  })
  sortBy: TaskSortField = 'createdAt';

  @ApiPropertyOptional({
    description: 'Direção da ordenação.',
    enum: SORT_ORDERS,
    default: 'desc',
  })
  @IsOptional()
  @IsIn(SORT_ORDERS, {
    message: `order precisa ser um de: ${SORT_ORDERS.join(', ')}`,
  })
  order: SortOrder = 'desc';

  toFilters(): TaskFilters {
    return {
      status: this.status,
      teamId: this.teamId,
      search: this.search || undefined,
    };
  }

  toSort(): TaskSort {
    return { field: this.sortBy, order: this.order };
  }
}
