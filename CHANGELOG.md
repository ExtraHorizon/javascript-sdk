# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Breaking changes

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
+
+await sdk.authenticate({
+  clientId: '',
+  password: '',
+  username: ''
+});
```

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
+await sdk.auth.authenticate({
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
