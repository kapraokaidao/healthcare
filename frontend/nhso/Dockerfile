FROM node:12.15.0-alpine3.9 as build_base
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . ./
RUN yarn build

FROM nginx:1.19-alpine
COPY --from=build_base /usr/src/app/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]