FROM node:8.14.0-alpine as builder
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install --production --silent && mv node_modules ../