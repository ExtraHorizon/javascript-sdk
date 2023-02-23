# Running the e2e tests
To run e2e tests, copy `.env.example` to `.env` and set up the credentials  
Then in `jest.config.js` comment line '/tests/e2e/' and run `yarn test:e2e`

Tips for setting the credentials in `.env`:
- The credentials should belong to a user without any permissions
- Use a confidential oAuth2 application so the refresh token can be reused multiple times
- Use 2 separate users for the oAuth1 password and token flow to prevent invalidating the tokens
