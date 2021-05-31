FROM node:14-alpine
WORKDIR /app
COPY . .
RUN yarn install && yarn build
RUN yarn global add serve
EXPOSE 3001
CMD serve -s build -l 3001