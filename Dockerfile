FROM node:22-alpine

RUN apk add --no-cache tini && \
    npm install -g @nestjs/cli

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --include=dev

COPY . .

RUN npm run build

EXPOSE 4000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main.js"]