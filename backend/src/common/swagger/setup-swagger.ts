import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SWAGGER_PATH = 'docs';

const DESCRIPTION = `
API de times e tarefas do desafio HITSS.

**Envelope de resposta.** Toda resposta de sucesso vem em \`{ "data": ... }\`.
Listagens adicionam \`"meta"\` com \`page\`, \`limit\`, \`total\` e \`totalPages\`.

**Erros.** Toda resposta de erro vem em \`{ "error": { "code", "message", "details?" } }\`.
\`code\` é o nome do status HTTP (\`NOT_FOUND\`, \`CONFLICT\`...) ou \`VALIDATION_ERROR\`,
caso em que \`details\` lista as mensagens de cada campo inválido.
`;

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Desafio HITSS API')
    .setDescription(DESCRIPTION.trim())
    .setVersion('1.0')
    .addTag('Health', 'Disponibilidade da API e do banco')
    .addTag('Teams', 'Times que agrupam tarefas')
    .addTag('Tasks', 'Tarefas, vinculadas a zero ou mais times')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    jsonDocumentUrl: `${SWAGGER_PATH}/json`,
    swaggerOptions: { persistAuthorization: true, tagsSorter: 'alpha' },
  });
}
