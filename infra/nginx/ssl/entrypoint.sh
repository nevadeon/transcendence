#!/bin/sh
set -e

SSL_DIR=/etc/nginx/ssl

mkdir -p $SSL_DIR

if [ ! -f $SSL_DIR/fullchain.pem ] || [ ! -f $SSL_DIR/privkey.pem ]; then
    echo "Generating self-signed SSL certificate..."
    openssl req -x509 -nodes -days 365 \
        -subj "/CN=localhost" \
        -newkey rsa:2048 \
        -keyout $SSL_DIR/privkey.pem \
        -out $SSL_DIR/fullchain.pem
fi

# Lancer Nginx en foreground
nginx -g "daemon off;"