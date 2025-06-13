FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS development
WORKDIR /app
COPY . .
COPY --from=deps /app/package*.json ./
COPY --from=deps /app/node_modules ./node_modules
CMD ["npm", "run", "start:dev"]

FROM node:22-alpine AS production
WORKDIR /app
COPY --from=deps /app/package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
CMD ["node", "./dist/main.js"]