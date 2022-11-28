# Cloud functions (or REST endpoints with extra steps)


### init function

- `appwrite init function`
- if init function fails the function defintion needs to be done manually:
    - add function-folder under `./functions`
    - add function-config. in `appwrite.json`


### deploy function


- if typescript is used create a build of the function `npm run build`
- `appwrite deploy function`, select function to deploy

### known issues

- check defined variables in the dashboard, alot of times the variables are not set initally, if so add them manually 
- check api-endpoint url, atm it is not possible to resolve to localhost even though appwrite is running there. should be the ip are dns-resolvable name
- deploying a function sometimes does not trigger a new build, just run deploy function again