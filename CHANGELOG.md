# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Breaking changes

Client initialization is changed. For example if you want to use the OAuth2 password flow, you no longer pass in the credentials as `oauth` property in the client. But you have to call the `authenticate` function. See README for other flows.

```diff
import { client } from '@extrahorizon/javascript-sdk';

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
+sdk.authenticate({
+  clientId: '',
+  password: '',
+  username: ''
+});
```
