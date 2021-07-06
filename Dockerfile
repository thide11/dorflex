FROM node:12-alpine
WORKDIR /app
COPY . .
RUN npm i
RUN npm start