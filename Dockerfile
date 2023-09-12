FROM node:lts-alpine

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./

EXPOSE 5000/tcp
ENV DATABASE_IP 127.0.0.1
ENV DATABASE_PORT 10000
ENV DATABASE_NAME tradidb
ENV DATABASE_USER admin
ENV DATABASE_PASSWORD admin

CMD ["npm", "start"]