# Get azure secrets from keyvault github action

This action gets the secrets from azure keyvault and sets them as github action secret variables in the action.

# Setup

```
npm ci
```

Build the script
```
npm run build
```

This puts the compiled script in the `dist` folder

# Usage

copy the contents of the `dist` folder into the folder `custom-gitub-actions/azure-env-vars` of the repository you want to use the action in.

Then add the following to your github action workflow file

```yaml
    - name: Get App Env Vars
      uses: ./custom-github-actions/azure-env-vars
      id: dev-vars
      with:
        keyvault_name: ${{ env.KEYVAULT_NAME }}	  	
        env: ${{ env.ENV_NAME }}
        app_name: ${{ env.APP }}
```

This needs to be used in conjuction with the azure login action.


# Structure your key vault

To use this action to the best effect, you should structure your key vault as follows by adding the following tags 
"tags": {
	"app_name": "{App Name}",
	"env": "{ Environment}",
	"key": " {Key Name}"
}

This allows the action to retrieve the correct secrets based on the environment and app name. The last tag is the key which is what sets the secret value to a specific key name in the action 


## TODO

- Add suport for optional env and app name
- add testing
