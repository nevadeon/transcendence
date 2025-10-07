export async function getVaultSecret(secretPath, key) {
	const res = await fetch(`${process.env.VAULT_ADDR}/v1/secret/data/${secretPath}`, {
		headers: { "X-Vault-Token": process.env.VAULT_TOKEN }
	});
	const body = await res.json();
	if (!body?.data?.data) {
		throw new Error(`Failed to get secret from Vault: ${secretPath}`);
	}
	const value = body.data.data[key];
	if (!value) {
		throw new Error(`Key '${key}' not found in Vault secret '${secretPath}'`);
	}
	return value;
}