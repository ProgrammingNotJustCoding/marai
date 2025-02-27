FROM node:lts-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:lts-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]