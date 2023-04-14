# Running the e2e tests
To run e2e tests, copy `.env.example` to `.env` and set up the credentials  
Then in `jest.config.js` comment line '/tests/e2e/' and run `yarn test:e2e`

Tips for setting the credentials in `.env`:
- The credentials should belong to a user without any permissions
- Use a confidential oAuth2 application so the refresh token can be reused multiple times
- Use 2 separate users for the oAuth1 password and token flow to prevent invalidating the tokens


## Reasoning for non optional Types in responses typing
In case people use strict mode in Typescript (which is best practice, and we don't do it yet). 
Developers will be required to null check every parameter while the endpoint is returning them. When the only scenario that the parameters are optional is when the are explictly omitted by adding an RQL select.

Because of this we advice to only make parameters optional if the endpoint doesn't return them by default.

## Listing endpoint with rql and rql
For each retrieval endoint we should implement the following methods
- find: provides a paginate list
- findAll: provides a complete list with automated pagination behind it
- first: returns the first value according to the querry
