# Authorize user-profile to read secret
path "secret/data/user-stats/*" {
	capabilities = ["read"]
}

path "secret/metadata/user-stats/*" {
  capabilities = ["read"]
}

# Forbiden the other option
path "*" {
	capabilities = []
}