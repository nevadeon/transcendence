FROM hashicorp/vault:1.15.3

USER root
RUN apk add --no-cache openssl bash

COPY init.sh /vault/init.sh
COPY policies /vault/policies
RUN chmod +x /vault/init.sh

# Démarre Vault en arrière-plan, attend qu'il soit prêt, puis lance init
ENTRYPOINT ["sh", "-c", "vault server -dev -dev-listen-address=0.0.0.0:8200 -dev-root-token-id=root & sleep 5 && /vault/init.sh && wait"]