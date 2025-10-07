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
vault policy write user-stats ./vault/policies/user-stats.hcl
vault policy write game ./vault/policies/game.hcl

# Create secret with KV v2 (simple format)
vault kv put secret/user-profile/config \
  USER_PROFILE_DB_PATH="${USER_PROFILE_DB_PATH}" \
  USER_PROFILE_PORT="${USER_PROFILE_PORT}" \
  GAME_PORT="${GAME_PORT}" \
  SECRET_SALT="${SECRET_SALT}" \
  JWT_SECRET="$(openssl rand -hex 32)" \
  JWT_TEMPORARY_SECRET="$(openssl rand -hex 32)"

vault kv put secret/user-stats/config \
  USER_STATS_PORT="${USER_STATS_PORT}" \
  USER_STATS_DB_PATH="${USER_STATS_DB_PATH}" \

vault kv put secret/game/config \
  GAME_PORT="${GAME_PORT}" \
  GAME_DB_PATH="${GAME_DB_PATH}" \

echo "Vault initialization complete!"