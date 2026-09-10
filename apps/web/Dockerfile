# apps/web/Dockerfile
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S arthalens && adduser -S arthalens -G arthalens
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
USER arthalens
EXPOSE 3000
CMD ["node", "server.js"]
