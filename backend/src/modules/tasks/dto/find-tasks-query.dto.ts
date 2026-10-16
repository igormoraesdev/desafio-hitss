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
  @IsOptional()
  @IsEnum(Status, {
    message: `status precisa ser um de: ${Object.values(Status).join(', ')}`,
  })
  status?: Status;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'teamId precisa ser um inteiro' })
  @IsPositive({ message: 'teamId precisa ser positivo' })
  teamId?: number;

  @IsOptional()
  @Transform(trim)
  @IsString({ message: 'search precisa ser do tipo string' })
  @MaxLength(SEARCH_MAX_LENGTH, {
    message: `search precisa ter no máximo ${SEARCH_MAX_LENGTH} caracteres`,
  })
  search?: string;

  @IsOptional()
  @IsIn(TASK_SORT_FIELDS, {
    message: `sortBy precisa ser um de: ${TASK_SORT_FIELDS.join(', ')}`,
  })
  sortBy: TaskSortField = 'createdAt';

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
