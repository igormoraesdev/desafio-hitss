import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { PageParams } from './pagination';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Página, começando em 1.',
    minimum: 1,
    default: DEFAULT_PAGE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page precisa ser um inteiro' })
  @Min(1, { message: 'page precisa ser maior ou igual a 1' })
  page: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    description: 'Itens por página.',
    minimum: 1,
    maximum: MAX_LIMIT,
    default: DEFAULT_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit precisa ser um inteiro' })
  @Min(1, { message: 'limit precisa ser maior ou igual a 1' })
  @Max(MAX_LIMIT, { message: `limit precisa ser no máximo ${MAX_LIMIT}` })
  limit: number = DEFAULT_LIMIT;

  toPageParams(): PageParams {
    return { skip: (this.page - 1) * this.limit, take: this.limit };
  }
}
