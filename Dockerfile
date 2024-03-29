FROM node:16-alpine

WORKDIR /app

COPY package.json package.json

COPY pnpm-lock.yaml pnpm-lock.yaml

RUN npm cache clean --force
RUN rm -rf node_modules

RUN npm config set registry  https://packages.aliyun.com/638eb9a6121be2db491c81fb/npm/npm-registry/

RUN npm install --location=global pnpm

RUN pnpm install

COPY . .

RUN pnpm build

ENV PORT 8080

EXPOSE 8080

CMD ["pnpm", "start"]
