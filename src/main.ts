import { DefaultAzureCredential } from '@azure/identity';  
import { SecretClient } from '@azure/keyvault-secrets';  
import core from '@actions/core';

async function main(){
	const keyVaultName = core.getInput('keyvault_name');
	const app = core.getInput('app_name');
	const env = core.getInput('env');

	// Authenticate to Azure
	const credential = new DefaultAzureCredential(); 
	
	const url = `https://${keyVaultName}.vault.azure.net`;  
	const client = new SecretClient(url, credential);
	console.log("Connected to Azure Key Vault");
	const secrets: any = [];
	for await (const secretProperties of client.listPropertiesOfSecrets()){
		// do something with properties
		const { name, properties, value } = await client.getSecret(secretProperties.name);
		secrets.push({name, value, tags: properties['tags']});
	}
	console.log("Fetched all the secrets from Azure Key Vault");
	// filter out the screts based on the tags from the input
	const names: any = [];
	for (let i = 0; i < secrets.length; i++) {
		const secret = secrets[i];
		const tags = secret.tags;
		if ((tags && tags['env'] && tags['app_name'] && tags['key']) && (tags['env'] === env && tags['app_name'] === app) ) {
			// add the secret to the context
			// @ts-ignore
			core.setSecret(secret['value']);
			core.exportVariable(tags['key'], secret['value']);
        	core.setOutput(tags['key'], secret['value']);
			names.push(secret['name']);
		}
	}
	console.log("Exported all the secrets to the context");
	core.setOutput('secrets', names);
}

main().catch((err) => {
	core.debug("Get secret failed with error: " + err);
    core.setFailed(!!err.message ? err.message : "Error occurred in fetching the secrets.");
	process.exit(1);
});