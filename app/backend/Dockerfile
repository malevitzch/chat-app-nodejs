FROM node:slim

WORKDIR /usr/src/app

COPY ./app/package*.json ./

RUN npm install

EXPOSE 8000

COPY ./app/. .
CMD ["node", "app.js"]
