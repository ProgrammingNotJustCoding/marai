FROM node:lts-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install -g pnpm
RUN pmpm install

COPY . .

RUN pnpm run build

FROM node:lts-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["serve", "-s", ".next", "-l", "3000"]