FROM node:12-alpine
WORKDIR /server
COPY ./package.json .
COPY ./dist .
RUN yarn
CMD ["node", "main"]