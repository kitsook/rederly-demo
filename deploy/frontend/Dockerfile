# build source
FROM node:12-alpine as builder

# set to production to run build
#ARG NODE_ENV=development

WORKDIR /app

COPY . ./
RUN npm install --silent
RUN npm run build

# actual image
FROM nginx:1.19

WORKDIR /app
COPY --from=builder /app/build /app
COPY nginx.conf /etc/nginx/nginx.conf
