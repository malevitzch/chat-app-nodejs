FROM nginx:alpine-slim
COPY ./page/. /var/www
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
