import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorBodyDto {
  @ApiProperty({
    description:
      'Identificador estável do erro. Para erros HTTP é o nome do status; para falhas de validação é VALIDATION_ERROR.',
    example: 'NOT_FOUND',
  })
  code: string;

  @ApiProperty({
    description: 'Mensagem legível para o cliente.',
    example: 'Time 42 não encontrado',
  })
  message: string;

  @ApiPropertyOptional({
    description:
      'Detalhes adicionais. Em VALIDATION_ERROR é a lista de mensagens de cada campo inválido.',
    type: [String],
    example: ['name é obrigatório', 'color precisa ser no formato hexadecimal'],
  })
  details?: string[];
}

export class ApiErrorDto {
  @ApiProperty({ type: ApiErrorBodyDto })
  error: ApiErrorBodyDto;
}
