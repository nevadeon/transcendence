export async function getVaultSecret(key) {
	const res = await fetch(`${process.env.VAULT_ADDR}/v1/secret/data/user-profile/config`, {
		headers: { "X-Vault-Token": process.env.VAULT_TOKEN }
	});

	const body = await res.json();

	if (!body?.data?.data) {
		throw new Error(`Failed to get secret from Vault: user-profile/config`);
	}

	const value = body.data.data[key];

	if (!value) {
		throw new Error(`Key '${key}' not found in Vault secret 'user-profile/config'`);
	}

	return value;
}