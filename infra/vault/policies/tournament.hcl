# Authorize tournament to read secret
path "secret/data/tournament/*" {
	capabilities = ["read"]
}

path "secret/metadata/tournament/*" {
  capabilities = ["read"]
}

# Forbiden the other option
path "*" {
	capabilities = []
}