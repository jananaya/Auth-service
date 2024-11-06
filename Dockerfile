FROM node:20 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20 AS production

WORKDIR /usr/src/app

COPY --from=build usr/src/app/dist ./dist

COPY package*.json ./
RUN npm install --only=production

ENV DB_HOST=value
ENV DB_USER=value
ENV DB_PASSWORD=value
ENV DB_PORT=value
ENV DB_NAME=value

ENV JWT_SECRET=value
ENV JWT_SECRET=value
ENV JWT_REFRESH_SECRET=value
ENV JWT_EXPIRATION=3600
ENV JWT_REFRESH_EXPIRATION=86400
ENV HASH_SALT=10


EXPOSE 3000

CMD ["node", "dist/main.js"]
