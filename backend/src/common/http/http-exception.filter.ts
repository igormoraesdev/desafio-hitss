import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiError } from './api-types';

interface ErrorResult {
  status: number;
  body: ApiError;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const { status, body } = this.toErrorResult(exception);

    if (status >= 500) {
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json(body);
  }

  private toErrorResult(exception: unknown): ErrorResult {
    if (!(exception instanceof HttpException)) {
      return formatError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'INTERNAL_SERVER_ERROR',
        'Erro interno do servidor',
      );
    }

    const status = exception.getStatus();
    const validationMessages = extractValidationMessages(exception);

    if (validationMessages) {
      return formatError(
        status,
        'VALIDATION_ERROR',
        'Dados inválidos',
        validationMessages,
      );
    }

    return formatError(status, HttpStatus[status], extractMessage(exception));
  }
}

function formatError(
  status: number,
  code: string,
  message: string,
  details?: unknown,
): ErrorResult {
  return {
    status,
    body: {
      error: !details ? { code, message } : { code, message, details },
    },
  };
}

function extractValidationMessages(
  exception: HttpException,
): string[] | undefined {
  const payload = exception.getResponse();
  if (typeof payload !== 'object' || !('message' in payload)) {
    return undefined;
  }
  return Array.isArray(payload.message) ? payload.message : undefined;
}

function extractMessage(exception: HttpException): string {
  const payload = exception.getResponse();
  if (typeof payload === 'string') {
    return payload;
  }
  if ('message' in payload && typeof payload.message === 'string') {
    return payload.message;
  }
  return exception.message;
}
