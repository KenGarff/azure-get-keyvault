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



