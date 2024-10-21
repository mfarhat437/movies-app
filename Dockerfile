# FROM node:20.11.0-alpine AS builder
# COPY package*.json .npmrc* /tmp/
# WORKDIR /tmp
# RUN npm install --only=production
# RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

# FROM node:20.11.0-alpine
# RUN apk add --update --no-cache curl vim
# COPY . /usr/src/app
# COPY --from=builder /usr/src/app /usr/src/app
# WORKDIR /usr/src/app
# EXPOSE 8080
# CMD [ "node", "app.js" ]
# Use the official Node.js image
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]