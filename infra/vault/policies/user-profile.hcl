# Authorize user-profile to read secret
path "secret/data/user-profile/*" {
	capabilities = ["read"]
}

path "secret/metadata/user-profile/*" {
  capabilities = ["read"]
}

# Forbiden the other option
path "*" {
	capabilities = []
}