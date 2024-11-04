FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

FROM node:18-alpine

WORKDIR /app

COPY --from=build /app /app

EXPOSE 8800

CMD ["node", "server.js"]
