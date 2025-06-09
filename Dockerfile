FROM node:22-alpine

RUN apk add --no-cache tini

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @nestjs/cli && \
    npm ci --include=dev
RUN npm run audit:fix || true

COPY . .

RUN npm run build

EXPOSE 4000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main.js"]