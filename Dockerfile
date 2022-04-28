FROM node:16.13-alpine

WORKDIR /app

COPY ./package.json /app/
COPY ./yarn.lock /app/

RUN yarn install

COPY . /app/
