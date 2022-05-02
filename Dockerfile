FROM node:16.15-alpine

WORKDIR /app

COPY ./package.json /app/
COPY ./yarn.lock /app/

RUN yarn install

COPY . /app/
