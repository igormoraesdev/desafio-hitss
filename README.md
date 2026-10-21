# Desafio HITSS

Monorepo com dois projetos:

- `backend/` — API REST em NestJS + Prisma + PostgreSQL
- `frontend/` — app mobile em React Native com Expo

## 1. Decisões arquiteturais

**Banco: PostgreSQL.** O domínio é relacional de verdade: times e tarefas com uma relação muitos-para-muitos no meio. Um banco relacional resolve isso com uma tabela de junção e integridade garantida pelo próprio banco. Postgres foi a escolha por ser o que eu mais uso, por rodar fácil em Docker e por ter suporte sólido no Prisma.

**ORM: Prisma.** Schema declarativo, migrations versionadas e um client tipado que elimina boa parte dos erros de query em tempo de compilação. O custo é depender do código gerado, que fica em `src/generated` e fora do git.

**Camadas do backend.** Cada módulo (`teams`, `tasks`) segue o mesmo desenho:

- `controller` — só roteamento, parse de parâmetros e documentação Swagger.
- `dto` — validação de entrada com `class-validator`, incluindo normalização (trim) e mensagens em português.
- `service` — regras de negócio: nome único de time, verificação de que os times de uma tarefa existem, erros HTTP semânticos.
- `repositories` — uma interface (`TeamsRepository`) e uma implementação Prisma. O service recebe a interface por injeção, então os testes unitários rodam com um mock e sem banco.

Transversal a tudo, em `src/common`: um interceptor que envelopa toda resposta em `{ data, meta? }`, um filter que converte qualquer exceção em `{ error: { code, message, details? } }`, paginação reutilizável e o logger.

**Logs com Pino.** Estruturados, com `x-request-id` propagado (ou gerado) em toda requisição, o que permite seguir uma chamada do controller ao banco. Em desenvolvimento a saída é legível; em produção vira JSON.

**Frontend: Expo + Expo Router.** Navegação por arquivos em `src/app`, com rotas tipadas (`experiments.typedRoutes`): um `router.push` para uma rota que não existe falha na compilação. As telas são finas: montam o `Container` com o cabeçalho e delegam o conteúdo a uma _section_.

**MVVM no app.** Cada camada tem uma pasta em `frontend/src`:

- `models` — tipos das entidades (`Teams`, `Tasks`) e do envelope da API (`ApiResponse`, `Meta`, filtros).
- `services` — cliente HTTP (axios) e uma função por endpoint. Só falam com a rede, não guardam estado.
- `viewmodels` — hooks por domínio que juntam TanStack Query, filtros e navegação, e entregam para a view só dados prontos e callbacks. `useTeams` e `useTasks` cuidam das listas (busca, paginação e troca otimista de status); `useCreateTeam` e `useCreateTask` dos formulários de criar e editar; `useTeamsDetail` e `useTaskDetail` do carregamento e da exclusão de um item. As chaves de cache ficam em `viewmodels/*/constants`.
- `schemas` — validação dos formulários com Zod, em português.
- `components` — views. `ui` são peças genéricas (`Button`, `Input`, `Skeleton`, seletor de cor), `layout` as peças de tela (`Container`, `HeaderButtons`, `EmptyState`), e `teams`/`tasks` tudo que é de cada domínio: botões, skeletons, listas, filtros, formulários e as _sections_. Uma _section_ é o único componente que chama um viewmodel; o resto recebe props.

**Estado de servidor: TanStack Query.** As listas usam `useInfiniteQuery` com a paginação do backend (10 por página, carrega mais ao chegar no fim). Criar, editar e excluir invalidam as listas afetadas. A troca de status da tarefa é otimista: a UI atualiza na hora, e se o PATCH falhar o cache volta ao snapshot anterior. A busca de tarefas é feita no servidor com _debounce_ de 300 ms.

**Formulários: react-hook-form + Zod.** O schema é a única fonte das regras (tamanhos, obrigatoriedade, mensagens) e seus tipos de entrada e saída alimentam o `useForm`. O mesmo formulário serve para criar e editar uma tarefa.

**Estilo: dripsy.** Tema único em `src/styles/theme.ts` (cores, espaçamentos, variantes de texto) consumido via `sx`. Animações de toque com Reanimated.

**Endereço da API.** O app descobre o host do Metro em tempo de execução (`expo-constants`) e assume a API na porta 3000 do mesmo IP. Assim o mesmo código funciona no simulador iOS, no emulador Android e num celular físico na mesma rede, sem configurar nada.

## 2. Modelo de dados

Duas entidades e uma relação muitos-para-muitos entre elas.

```jsonc
// teams
{
  "id": 1,                 // inteiro, autoincremento
  "name": "Frontend",      // único
  "color": "#3b82f6",      // hexadecimal
  "createdAt": "2026-10-16T12:00:00.000Z",
  "updatedAt": "2026-10-16T12:00:00.000Z"
}

// tasks
{
  "id": 4,
  "title": "Integrar app com a API",
  "description": "Cliente HTTP e tratamento do envelope",   // opcional
  "status": "IN_PROGRESS",   // PENDING | IN_PROGRESS | COMPLETED, nasce PENDING
  "teams": [ { "id": 1, "name": "Frontend", "color": "#3b82f6" } ],   // zero ou mais
  "createdAt": "2026-10-16T12:00:00.000Z",
  "updatedAt": "2026-10-16T12:00:00.000Z"
}
```

A relação entre `tasks` e `teams` fica numa tabela de junção (`_TasksToTeams`) que o Prisma gera e mantém sozinho. Apagar um time não apaga as tarefas, só o vínculo; o inverso também vale.

As três migrations em `backend/prisma/migrations` contam a história: a primeira cria o schema, as outras duas renomeiam `team` para `teams`. A terceira foi escrita à mão com `ALTER TABLE ... RENAME` porque o Prisma, sozinho, geraria um drop/create e perderia os dados.

## 3. Como rodar

Pré-requisitos: Docker. Para desenvolver no backend, também Node 24 (o `require(esm)` do Jest 30 precisa de 24.9+) e Yarn.

### Tudo pelo Docker (jeito mais rápido de testar)

```bash
cp .env.example .env
docker compose up --build
```

Isso sobe o Postgres e o backend. O container do backend aplica as migrations, roda o seed (3 times e 10 tarefas) e inicia a API em `http://localhost:3000`. Para mudar a porta, ajuste `BACKEND_PORT` no `.env`. O seed é idempotente, então subir de novo não duplica dados.

A documentação interativa fica em [http://localhost:3000/docs](http://localhost:3000/docs). Para checar que está tudo de pé: `GET /v1/health`.

### Backend em modo de desenvolvimento

```bash
cp .env.example .env
cp backend/.env.example backend/.env

docker compose up -d postgres        # só o banco

cd backend
yarn
yarn prisma:generate                 # gera o client
yarn prisma:migrate                  # aplica as migrations
yarn prisma:seed                     # dados de exemplo
yarn start:dev                       # http://localhost:3000 com reload
```

Testes: `yarn test` (unitários, sem banco) e `yarn test:e2e` (sobe a API contra o Postgres do compose e exercita todas as rotas; precisa do banco no ar). Lint: `yarn lint`. Para zerar o banco e recarregar o seed: `yarn prisma migrate reset`.

### Frontend

Pré-requisitos: Node 24, Yarn e, para rodar o app, um destes:

- **Expo Go** no celular (iOS ou Android), na mesma rede Wi-Fi do computador.
- Simulador iOS (Xcode) ou emulador Android (Android Studio).

A API precisa estar no ar antes, pelo Docker ou em modo de desenvolvimento (seções acima), em `http://localhost:3000`.

```bash
cd frontend
yarn
yarn start      # abre o Metro; i para iOS, a para Android, ou leia o QR code no Expo Go
```

Verificações:

```bash
yarn lint                                 # eslint
npx tsc --noEmit -p tsconfig.json         # tipos
yarn test                                 # jest + Testing Library (tests/)
```

## 4. Exemplos de requisições

Todos os endpoints podem ser testados direto no Swagger, em [http://localhost:3000/docs](http://localhost:3000/docs), com os schemas, exemplos e respostas de erro de cada rota. O documento OpenAPI bruto fica em `/docs/json`, pronto para importar no Insomnia ou Postman.

Os exemplos abaixo usam `curl` contra a API no ar com o seed aplicado. Toda resposta de sucesso vem em `{ data, meta? }`; toda falha vem em `{ error: { code, message, details? } }`.

### Health

```bash
curl http://localhost:3000/v1/health
```

```json
{
  "data": {
    "status": "ok",
    "database": "up",
    "timestamp": "2026-10-21T20:26:49.551Z"
  }
}
```

### Times

Listar, com paginação e busca por trecho do nome (sem diferenciar maiúsculas). Cada time vem com suas tarefas.

```bash
curl "http://localhost:3000/v1/teams?page=1&limit=10&search=front"
```

```json
{
  "data": [
    {
      "id": 1,
      "name": "Frontend",
      "color": "#3b82f6",
      "createdAt": "2026-10-16T21:12:31.494Z",
      "updatedAt": "2026-10-21T20:08:53.522Z",
      "tasks": [
        {
          "id": 3,
          "title": "Criar tela de listagem de tarefas",
          "status": "IN_PROGRESS"
        }
      ]
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
}
```

Criar. O nome é único e a cor aceita hex de 3 ou 6 dígitos.

```bash
curl -X POST http://localhost:3000/v1/teams \
  -H "Content-Type: application/json" \
  -d '{ "name": "Design", "color": "#a855f7" }'
```

```json
{
  "data": {
    "id": 4,
    "name": "Design",
    "color": "#a855f7",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Buscar por id, atualizar parcialmente e remover. Remover um time não apaga as tarefas, só o vínculo.

```bash
curl http://localhost:3000/v1/teams/4

curl -X PATCH http://localhost:3000/v1/teams/4 \
  -H "Content-Type: application/json" \
  -d '{ "color": "#f59e0b" }'

curl -X DELETE http://localhost:3000/v1/teams/4        # 204 sem corpo
```

### Tarefas

Listar, com filtros combináveis: `teamId`, `status` (`PENDING`, `IN_PROGRESS`, `COMPLETED`), `search` no título, `sortBy` (`title`, `status`, `createdAt`, `updatedAt`), `order` (`asc`, `desc`), `page` e `limit`. Sem `teamId`, lista as tarefas de todos os times.

```bash
curl "http://localhost:3000/v1/tasks?teamId=1&status=IN_PROGRESS&search=tela&sortBy=createdAt&order=desc&page=1&limit=10"
```

```json
{
  "data": [
    {
      "id": 3,
      "title": "Criar tela de listagem de tarefas",
      "description": "Lista com filtros por status, time e busca",
      "status": "IN_PROGRESS",
      "createdAt": "2026-10-16T21:12:31.560Z",
      "updatedAt": "2026-10-21T20:08:53.590Z",
      "teams": [
        {
          "id": 1,
          "name": "Frontend",
          "color": "#3b82f6",
          "createdAt": "...",
          "updatedAt": "..."
        }
      ]
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
}
```

Criar. `title` tem entre 3 e 100 caracteres; `description`, `status` e `teamIds` são opcionais. Sem `status`, nasce `PENDING`; sem `teamIds`, nasce sem time.

```bash
curl -X POST http://localhost:3000/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{ "title": "Publicar release", "description": "Build e notas", "status": "PENDING", "teamIds": [1, 2] }'
```

Buscar por id, alterar só o status (é o que o app faz na ação rápida), trocar os times e remover. Em `teamIds`, a lista enviada substitui a atual e `[]` desvincula todos.

```bash
curl http://localhost:3000/v1/tasks/3

curl -X PATCH http://localhost:3000/v1/tasks/3 \
  -H "Content-Type: application/json" \
  -d '{ "status": "COMPLETED" }'

curl -X PATCH http://localhost:3000/v1/tasks/3 \
  -H "Content-Type: application/json" \
  -d '{ "teamIds": [] }'

curl -X DELETE http://localhost:3000/v1/tasks/3        # 204 sem corpo
```

### Erros

Validação (400), com uma mensagem por campo em `details`:

```bash
curl -X POST http://localhost:3000/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{ "title": "ab", "status": "DONE" }'
```

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      "title precisa ter ao menos 3 caracteres",
      "status precisa ser um de: PENDING, IN_PROGRESS, COMPLETED"
    ]
  }
}
```

Não encontrado (404) e conflito de nome (409):

```json
{ "error": { "code": "NOT_FOUND", "message": "Time 999999 não encontrado" } }
{ "error": { "code": "CONFLICT", "message": "Já existe um time com o nome \"Frontend\"" } }
```

Toda resposta carrega o header `x-request-id`. Envie o seu para correlacionar com os logs, ou a API gera um.

## 5. O que faria diferente em produção

- **Segurança.** Autenticação (JWT ou sessão), rate limit, `helmet`, CORS restrito aos domínios do app em vez de `*`.
- **Observabilidade.** Os logs já são JSON com request id; faltaria enviá-los a um agregador e adicionar métricas e tracing (OpenTelemetry).
- **Banco.** Pool de conexões dimensionado, índices em `tasks.status` e `tasks.title` conforme as consultas reais, e migrations rodando num passo separado do deploy (`prisma migrate deploy`).
- **Cache.** As listagens são candidatas a cache curto (Redis ou HTTP cache) quando o volume justificar.
- **Escalabilidade.** A API é stateless, então escala horizontalmente atrás de um load balancer; o banco seria gerenciado, com réplica de leitura se necessário.
- **Entrega.** Pipeline de CI com lint, testes e build e variáveis de ambiente vindas de um secret manager.
