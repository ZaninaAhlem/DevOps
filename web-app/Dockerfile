FROM node:18 AS build

WORKDIR /app

COPY package*.json  ./

RUN npm ci

COPY . .

ENV NODE_ENV=production

RUN npm run build --debug

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html


COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
