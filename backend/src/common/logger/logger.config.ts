import { Params } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { IncomingMessage, ServerResponse } from 'node:http';

const REQUEST_ID_HEADER = 'x-request-id';

export function buildLoggerConfig(): Params {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    pinoHttp: {
      level: process.env.LOG_LEVEL ?? (isProduction ? 'info' : 'debug'),
      transport: isProduction
        ? undefined
        : {
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: true,
              translateTime: 'HH:MM:ss.l',
              ignore: 'pid,hostname',
            },
          },
      genReqId: (req, res) => {
        const incoming = req.headers[REQUEST_ID_HEADER];
        const id = typeof incoming === 'string' ? incoming : randomUUID();
        res.setHeader(REQUEST_ID_HEADER, id);
        return id;
      },
      customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },
      customSuccessMessage: (req, res) =>
        `${req.method} ${req.url} ${res.statusCode}`,
      customErrorMessage: (req, res) =>
        `${req.method} ${req.url} ${res.statusCode}`,
      serializers: {
        req: (req: IncomingMessage & { id?: string }) => ({
          id: req.id,
          method: req.method,
          url: req.url,
        }),
        res: (res: ServerResponse) => ({ statusCode: res.statusCode }),
      },
      redact: ['req.headers.authorization', 'req.headers.cookie'],
    },
  };
}
