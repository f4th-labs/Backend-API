FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN mkdir -p dist/database

RUN npm run build

COPY --chown=node:node src/database/run-migrations.js dist/database/

ENV NODE_ENV=production

RUN npm ci --only=production && npm cache clean --force

USER node

FROM node:20-alpine AS production

WORKDIR /usr/src/app

RUN apk add --no-cache netcat-openbsd

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/package*.json ./
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

USER node
