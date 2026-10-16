import { ApiProperty } from '@nestjs/swagger';
import { PaginationMeta } from './pagination';

export class PaginationMetaDto implements PaginationMeta {
  @ApiProperty({ description: 'Página atual, começando em 1.', example: 1 })
  page: number;

  @ApiProperty({ description: 'Itens por página.', example: 10 })
  limit: number;

  @ApiProperty({
    description: 'Total de itens que atendem ao filtro.',
    example: 23,
  })
  total: number;

  @ApiProperty({ description: 'Total de páginas.', example: 3 })
  totalPages: number;
}
