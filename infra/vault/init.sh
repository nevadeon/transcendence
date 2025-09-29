#!/bin/bash

export VAULT_ADDR="http://0.0.0.0:8200"
export VAULT_TOKEN="${VAULT_TOKEN:-root}"

while ! vault status > /dev/null 2>&1; do
  echo "Waiting for Vault to be ready..."
  sleep 2
done

echo "Vault is ready!"

# Create policy
vault policy write user-profile ./vault/policies/user-profile.hcl

# Create secret with KV v2 (simple format)
vault kv put secret/user-profile/config \
  USER_DB_PATH="${USER_DB_PATH}" \
  USER_PROFILE_PORT="${USER_PROFILE_PORT}" \
  GAME_PORT="${GAME_PORT}" \
  JWT_SECRET="$(openssl rand -hex 32)"

echo "Vault initialization complete!"