# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --force

COPY prisma ./prisma
COPY . .

RUN npm run build

# Etapa de produção
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --force

COPY prisma ./prisma
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 3001