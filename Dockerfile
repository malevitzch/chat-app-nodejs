FROM nginx:alpine
COPY ./app/page/. /usr/share/nginx/html/

RUN apk add --no-cache python3 py3-pip

