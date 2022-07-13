FROM nginx:1.15-alpine
COPY dist /etc/nginx/dist
WORKDIR /etc/nginx/html
