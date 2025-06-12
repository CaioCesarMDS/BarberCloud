# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install --force

# Copia schema e gera Prisma Client (necessário aqui também)
COPY prisma ./prisma
RUN npx prisma generate

# Copia o restante do projeto e compila
COPY . .
RUN npm run build


# Etapa de produção
FROM node:20-alpine

WORKDIR /app

# Copia apenas o necessário para produção
COPY package*.json ./
RUN npm install --omit=dev --force

# Copia o Prisma schema (necessário para gerar novamente)
COPY prisma ./prisma
RUN npx prisma generate

# Copia os arquivos buildados
COPY --from=builder /app/dist ./dist

# Expõe porta e define comando de execução
EXPOSE 3001
CMD ["node", "dist/src/main"]


# COMANDS
# Clean Containers and volumes: docker system prune -af, docker volume prune -f
# Clean Logs in cloud9: sudo journalctl --vacuum-time=1d