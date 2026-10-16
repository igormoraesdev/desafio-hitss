FROM node:24-alpine AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build && yarn build:seed

RUN yarn install --frozen-lockfile --production --ignore-scripts \
  && node_modules/.bin/prisma --version > /dev/null

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production

RUN apk upgrade --no-cache \
  && rm -rf /usr/local/lib/node_modules /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack /opt/yarn*

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/dist-seed ./dist-seed
COPY --chown=node:node --from=build /app/src/generated ./src/generated
COPY --chown=node:node package.json prisma.config.ts ./
COPY --chown=node:node prisma ./prisma

USER node
EXPOSE 3000
# Aplica as migrations, roda o seed (idempotente) e sobe a API.
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist-seed/prisma/seed.js && exec node dist/main.js"]
