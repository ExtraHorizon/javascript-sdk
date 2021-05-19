# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0-dev]

- Mail Service
- Template Service

### Breaking changes

- PagedResults are now using generic schemas format

## [Unreleased]

## [2.0.0] - 2021-05-12

### Breaking changes

- ClientId for OAuth2 and consumerkey/secret for Oauth1 are now passed in during client initialization in stead of authentication. This way on not authenicated calls the clientId and consumerkey/secret information is added to the requests.

OAuth2

```diff
const sdk = client({
  apiHost: '',
+ clientId: '',
});

await sdk.authenticate({
-  clientId: '',
  password: '',
  username: ''
});
```

OAuth1

```diff
const sdk = client({
  apiHost: '',
+ consumerKey: '',
+ consumerSecret: '',
});

await sdk.authenticate({
- consumerKey: '',
- consumerSecret: '',
  password: '',
  email: ''
});
```

### Changes

- Removed `query` from list results
- `PartialUserData` is renamed to `User`
- Changes to the `UserData` interface
  - `language` type is changed from `string` to `LanguageCode`
  - `timeZone` type is changed from `string` to `TimeZone`
  - `lastFailedTimestamp` type is changed from `number` to `Date`
  - added `creationTimestamp` and `updateTimestamp`
- Change to the `RegisterUserData` interface
  - `phoneNumber` is now required

## [1.0.1] - 2021-05-05

### Changes

- Correctly exporting all the possible errors.

## [1.0.0] - 2021-05-05

### Breaking changes

Optional paramaters are now grouped in an options object as last parameters.

```diff
- await sdk.tasks.find(rql);
+ await sdk.tasks.find({ rql });
```

```diff
- await sdk.users.getGroupsRoles(groupId, rql);
+ await sdk.tasks.getGroupsRoles(groupId, { rql });
```

### Added

- The Axios instance used by the SDK is now directly accessible
- Data Service now includes:
  - Transitions Service
  - Documents Service
  - Comments Service
- You can pass in your own interface when calling the `sdk.data.findDocuments<CustomDocument>(schemaId);` endpoint
- The SDK also expose JSON-schema interface you can use to compose your own

### Changes

- OAuth1 token/tokenSecret flow is implemented.
- Functions expecting an RQL should now show a more clear error when passing in a regular string.

## [0.0.7] - 2021-04-28

### Breaking changes

The `authenticate` and `confirmMfa` methods have been scoped under the `auth` namespace.

```diff
-await sdk.authenticate({ refreshToken: '' });
+await sdk.auth.authenticate({ refreshToken: '' });
```

Certains methods under the `users` namespace have had their name changed.

```diff
-sdk.user.mfaDisable
+sdk.user.disableMfa
-sdk.user.mfaEnable
+sdk.user.enableMfa
-sdk.user.mfaSetting
+sdk.user.getMfaSetting
-sdk.user.mfaAddMethod
+sdk.user.addMfaMethod
-sdk.user.mfaMethodConfirmVerification
+sdk.user.confirmMfaMethodVerification
-sdk.user.mfaRemoveMethod
+sdk.user.removeMfaMethod
```

Removed `debug` option. Use `responseLogger` and `requestLogger` options in stead. See README for example.

```diff
-const sdk = client({
-  apiHost: '',
-  debug: true
-});


+import AxiosLogger from "axios-logger";
+
+const sdk = client({
+  apiHost: '',
+  requestLogger: AxiosLogger.requestLogger,
+  responseLogger: AxiosLogger.responseLogger
+});
```

### Added

- Tasks Service
- Data Service now includes:
  - Schemas Service
  - Properties Service
  - Statuses Service
  - Indexes Service

## [0.0.6] - 2021-04-21

### Breaking changes

Client initialization is changed. For example if you want to use the OAuth2 password flow, you no longer pass in the credentials as `oauth` property in the client. But you have to call the `authenticate` function. See README for other flows.

```diff
-const sdk = client({
-  apiHost: '',
-  oauth: {
-    clientId: '',
-    password: '',
-    username: '',
-  },
-});

+const sdk = client({
+  apiHost: '',
+});
+
+await sdk.authenticate({
+  clientId: '',
+  password: '',
+  username: ''
+});
```

### Added

- Multi-factor authentication via (authenticate / confirmMfa functions).
- `freshTokensCallback` option when creating the client. Pass in a function to retrieve the response when new tokens are received.
- OAuth2 Refresh Token Grant flow.
- `files` service.
- `data` service: only to create a schema at the moment.

### Changes

- Functions that accept an RQL parameter no longer accepts regular string, but expect the output of and rqlBuilder -> build().
- `ApiError` now extends the built-in `Error`.
- Some functions allowed empty `requestBody` which was incorrect in some cases, these have been fixed as well.
