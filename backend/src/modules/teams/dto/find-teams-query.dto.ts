import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { trim } from 'src/common/utils/string';

const SEARCH_MAX_LENGTH = 100;

export interface TeamFilters {
  search?: string;
}

export class FindTeamsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Busca por trecho do nome, sem diferenciar maiúsculas.',
    maxLength: SEARCH_MAX_LENGTH,
    example: 'front',
  })
  @IsOptional()
  @Transform(trim)
  @IsString({ message: 'search precisa ser do tipo string' })
  @MaxLength(SEARCH_MAX_LENGTH, {
    message: `search precisa ter no máximo ${SEARCH_MAX_LENGTH} caracteres`,
  })
  search?: string;

  toFilters(): TeamFilters {
    return { search: this.search || undefined };
  }
}
