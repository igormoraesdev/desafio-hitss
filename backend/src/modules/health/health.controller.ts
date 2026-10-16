import {
  Controller,
  Get,
  HttpStatus,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import {
  ApiDataResponse,
  ApiErrorResponses,
} from 'src/common/swagger/api-responses.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

export class HealthStatusDto {
  @ApiProperty({ enum: ['ok'] })
  status: 'ok';

  @ApiProperty({ enum: ['up'] })
  database: 'up';

  @ApiProperty({ type: String, format: 'date-time' })
  timestamp: string;
}

@ApiTags('Health')
@Controller('v1/health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    @InjectPinoLogger(HealthController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Verifica a API e o banco',
    description: 'Executa um SELECT 1 no Postgres. Retorna 503 se falhar.',
  })
  @ApiDataResponse(HealthStatusDto)
  @ApiErrorResponses(HttpStatus.SERVICE_UNAVAILABLE)
  async check(): Promise<HealthStatusDto> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error: unknown) {
      this.logger.error({ err: error }, 'Banco de dados indisponível');
      throw new ServiceUnavailableException('Banco de dados indisponível');
    }
    return {
      status: 'ok',
      database: 'up',
      timestamp: new Date().toISOString(),
    };
  }
}
