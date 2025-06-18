FROM node:18
WORKDIR /usr/src/app
RUN npm install -g pnpm
COPY pnpm-lock.yaml package.json ./
COPY .env.production .env
RUN pnpm install
COPY . .
COPY .env.production .env
RUN pnpm build
EXPOSE 4173
CMD ["pnpm", "preview", "--host", "--port", "4173"]

