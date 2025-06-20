FROM node:18
WORKDIR /usr/src/app
RUN npm install -g pnpm
COPY pnpm-lock.yaml package.json ./
RUN pnpm install
COPY . .
ARG VITE_API_URL=http://localhost:5000/api
RUN echo "VITE_API_URL=$VITE_API_URL" > .env
RUN pnpm build
EXPOSE 4173
CMD ["pnpm", "preview", "--host", "--port", "4173"]

