FROM node

WORKDIR /usr/src/app

COPY ./app/package*.json ./

RUN npm install

RUN apt update && apt install -y sqlite3

EXPOSE 8000

COPY ./app/. .
CMD ["node", "app.js"]
