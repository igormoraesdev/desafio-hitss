import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginationMetaDto } from '../pagination/pagination-meta.dto';
import { ApiErrorDto } from './api-error.dto';

interface DataResponseOptions {
  status?: HttpStatus;
  description?: string;
}

export function ApiDataResponse<T>(
  model: Type<T>,
  { status = HttpStatus.OK, description }: DataResponseOptions = {},
) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status,
      description,
      schema: {
        required: ['data'],
        properties: { data: { $ref: getSchemaPath(model) } },
      },
    }),
  );
}

export function ApiPaginatedResponse<T>(model: Type<T>, description?: string) {
  return applyDecorators(
    ApiExtraModels(model, PaginationMetaDto),
    ApiResponse({
      status: HttpStatus.OK,
      description,
      schema: {
        required: ['data', 'meta'],
        properties: {
          data: { type: 'array', items: { $ref: getSchemaPath(model) } },
          meta: { $ref: getSchemaPath(PaginationMetaDto) },
        },
      },
    }),
  );
}

const ERROR_DESCRIPTIONS: Partial<Record<HttpStatus, string>> = {
  [HttpStatus.BAD_REQUEST]:
    'Dados inválidos (VALIDATION_ERROR, com `details`) ou parâmetro malformado (BAD_REQUEST).',
  [HttpStatus.NOT_FOUND]: 'Recurso não encontrado.',
  [HttpStatus.CONFLICT]: 'Conflito com um registro existente.',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'Dependência indisponível.',
};

export function ApiErrorResponses(...statuses: HttpStatus[]) {
  return applyDecorators(
    ApiExtraModels(ApiErrorDto),
    ...statuses.map((status) =>
      ApiResponse({
        status,
        description: ERROR_DESCRIPTIONS[status],
        type: ApiErrorDto,
      }),
    ),
  );
}
