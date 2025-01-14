# Get azure secrets from keyvault github action

This action gets the secrets from azure keyvault and sets them as github action secret variables in the action.

# Usage

copy the contents of the `dist` folder into the folder `custom-gitub-actions/azure-env-vars` of the repository you want to use the action in.

Then add the following to your github action workflow file

```yaml
    - name: Get App Env Vars
      uses: KenGarff/azure-get-keyvault@v1.0
      id: dev-vars
      with:
        keyvault_name: ${{ env.KEYVAULT_NAME }}	  	
        env: ${{ env.ENV_NAME }}
        app_name: ${{ env.APP }}
```

This needs to be used in conjuction with the azure login action.

Example action

```yaml
name: My App CD Prod

on:
  push:
    branches: [ main ]

env:
  APP: my-app
  ENV_NAME: prod

jobs:
  build_and_deploy:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    defaults:
      run:
        working-directory: ./${{ env.APP }}

    steps:
      - uses: actions/checkout@v4.1.1

      - name: Azure Authentication
        uses: azure/login@v1
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Install Dependencies
        run: npm ci

      - name: Get App Env Vars
        uses: KenGarff/azure-get-keyvault@v1.0
        id: prod-vars
        with:
          keyvault_name: ${{ env.KEYVAULT_NAME }}	
          env: ${{ env.ENV_NAME }}
          app_name: ${{ env.APP }}
	
	  # Now you can take the variables from the output of the action and use them in your action or create a env file for you app which all get added to 

        # example using the env vars that got set from the action to create a .env for a nodejs app
      - name: Prep Server Env Vars
        run : |
            touch .env
            echo "NODE_ENV=${NODE_ENV}" >> .env
            echo "PORT=${APP_PORT}" >> .env
            echo "APP_ENV=${APP_ENV}" >> .env

      # Azure logout 
      - name: logout
        if: always()
        run: |
          az logout
```

# Structure your key vault

To use this action to the best effect, you should structure your key vault as follows by adding the following tags 
"tags": {
	"app_name": "{App Name}",
	"env": "{ Environment}",
	"key": " {Key Name}"
}

This allows the action to retrieve the correct secrets based on the environment and app name. The last tag is the key which is what sets the secret value to a specific key name in the action 

# Setup

```
npm ci
```

Build the script
```
npm run build
```

This puts the compiled script in the `dist` folder


## TODO

- Add suport for optional env and app name
- add testing
