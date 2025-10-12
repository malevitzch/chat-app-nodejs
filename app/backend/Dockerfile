FROM node:20-slim

WORKDIR /usr/src/app

COPY ./app/package*.json ./

RUN apt update && apt install -y --no-install-recommends sqlite3

RUN npm install --omit=dev

COPY ./app/. .

EXPOSE 8000

CMD ["node", "app.js"]
