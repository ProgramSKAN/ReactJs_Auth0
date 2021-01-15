# ReactJs_Auth0

npm install auth0-js@9.13.4 auth0-lock@11.25.1 express@4.17.1 express-jwt@5.3.1 express-jwt-authz@1.0.0 jwks-rsa@1.3.0 npm-run-all@4.1.5 react-router-dom@5.2.0

## Package Description

1. auth0-js : Auth0 client side library
2. auth0-lock : Auth0 embedded lock widget
3. express : Quickly create APIs in Node
4. express-jwt : Validate JWTs
5. express-jwt-authz : Validate JWT scopes
6. jwks-rsa : Generate RSA keys for JWTs
7. npm-run-all : Run npm scripts in parallel
8. react-router-dom : Routing for React

# Auth0

1. https://auth0.github.io/auth0.js/index.html
2. https://auth0.com/docs/tokens/token-storage
3. Auth0 recommands to store tokens in-memory instead of localstorage/without-httponly-cookies, to avoid XSS. (if server,then store in httponly-cookie)
4. if you store tokens in memory, won't the user have to login again if they open new tab/close their tab?----->Use Silent Auth to avoid this issue.
5. https://react-auth0-skan.us.auth0.com/.well-known/jwks.json
6. add callbackurl http://localhost:3000/callback in Auth0>applications>select app>Allowed Callback URLs
7. add http://localhost:3000 in Auth0>applications>select app>Allowed Logout URLs

# React proxy api in dev

https://create-react-app.dev/docs/proxying-api-requests-in-development/

# To Secure an API call with Auth0

1. create API definition
2. Auth0>APIs>create API
3. enter a name and identifier. you can choose to be specific or create a separate entry for each unique api that your app will consume.Handling multiple endpoints be a single auth0 api entry means you can use single authorization request to give the user an access token that will work for multiple apis.if you create separate apis in auth0 dashbord then you need to handle multiple authorization requests so that your client receives an access token for each separate api.
4. use a separate Auth0 tenant for each environment and set the API identifier to APIs URL in that environment.
5. in simple case, create a single api entry
   say: Name=Demp App API on localhost
   Identifier=http://localhost:3001
