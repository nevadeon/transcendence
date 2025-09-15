FROM nginx:stable-alpine

RUN apk add --no-cache openssl bash

COPY nginx.conf /etc/nginx/nginx.conf
COPY ssl/entrypoint.sh /entrypoint.sh

# Exposer ports
EXPOSE 80 443

ENTRYPOINT ["/entrypoint.sh"]