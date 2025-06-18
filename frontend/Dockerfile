FROM node:18
WORKDIR /usr/src/app
RUN npm install -g pnpm
COPY pnpm-lock.yaml package.json ./
RUN pnpm install
COPY . .
RUN pnpm build
EXPOSE 4173
CMD ["pnpm", "preview", "--host", "--port", "4173"]
