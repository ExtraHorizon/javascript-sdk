# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [8.1.0]

### Changed

- `exh.users.requestPasswordReset`
  - Now also accepts an object with an `email` and `mode` field
  - Additional errors are thrown when forgot password request limiting is enabled or the pin code mode is used
- `exh.users.validatePasswordReset`
  - Alternatively now also accepts a `email` and `pinCode` field
  - Additional errors are thrown when using the pin code mode
- `exh.users.getEmailTemplates` and `exh.users.setEmailTemplates` now support the new pin code email templates:
  - `oidcUnlinkPinEmailTemplateId`
  - `activationPinEmailTemplateId`
  - `reactivationPinEmailTemplateId`
  - `passwordResetPinEmailTemplateId`

### Added

- Methods to work with the activation requests:
  - `exh.users.activationRequests.find`
  - `exh.users.activationRequests.remove`
- Methods to work with the forgot password requests:
  - `exh.users.forgotPasswordRequests.find`
  - `exh.users.forgotPasswordRequests.remove`
- Methods to work with the user verification settings:
  - `exh.users.settings.getVerificationSettings`
  - `exh.users.settings.updateVerificationSettings`

### Fixed

- `exh.auth.applications.deleteVersion` now calls the correct endpoint

## [8.0.0]

### Changed
- **Breaking Change:** RQL values are now [double encoded](https://docs.extrahorizon.com/extrahorizon/additional-resources/resource-query-language-rql#double-encoding-of-special-characters) by default when using the RQL builder
  - Disable double encoding for all RQL operations with `rqlBuilder.doubleEncodeValues = false`
  - Disable double encoding for a single RQL operation `rqlBuilder({ doubleEncodeValues: false }).eq(name, '< value >').build()`
  - Please consult the [Migration Guide](https://github.com/ExtraHorizon/javascript-sdk/blob/dev/MIGRATING_TO_V8.0.0.MD) for more information
- **Breaking Change:** Starting from v8.0.0, the SDK will no longer normalize custom keys in requests and responses. This means that all custom keys will be sent and received as they are provided.
  - The normalization of custom keys can be re-enabled for a single operation to the behavior before 8.0.0 by setting the option `exh.service.operation({ normalizeCustomData: true })`
  - The normalization of custom keys can be re-enabled for all operations on a client to the behavior before 8.0.0 using the snippet `exh = createClient({ ...options, normalizeCustomData: true });`
  - Please consult the [Migration Guide](https://github.com/ExtraHorizon/javascript-sdk/blob/dev/MIGRATING_TO_V8.0.0.MD) for more information
- **Breaking Change:** For all unauthenticated methods the response will now undergo the same transformation steps as any other request.
  - The timestamps previously returned as strings are now converted to date objects in `exh.auth.authenticate`, `exh.auth.confirmMfa` and`exh.users.createAccount`.
  - Please consult the [Migration Guide](https://github.com/ExtraHorizon/javascript-sdk/blob/dev/MIGRATING_TO_V8.0.0.MD) for more information
- New implementation of the hashing for oAuth1 signature generation
    - This change is not expected to have any impact on the SDK usage

### Bug Fixes
- In the `TokenDataOauth1` interface `updateTimeStamp` is changed to `updateTimestamp`
- `timeZone` is now accepted as a valid parameter for the resolve functions in the template service


## [v7.8.0]

### Changed
- New implementation of the oAuth1 signature generation to support double Encoding of RQL values in `OAuth1` clients

## [v7.7.0]

### Added
- Functionality to allow the [double encoding](https://docs.extrahorizon.com/extrahorizon/additional-resources/resource-query-language-rql#double-encoding-of-special-characters) of values when using the RQL builder
  - Enable double encoding for all RQL operations with `rqlBuilder.doubleEncodeValues = true`
  - Enable double encoding for a single RQL operation `rqlBuilder({ doubleEncodeValues: true }).eq(name, '< value >').build()`
  - When enabling double encoded values ensure that instances of encoding values for the rql builder such as `encodeURIComponent()` are removed
  - Double Encoding of RQL values is currently only supported in `OAuth2` clients and will come to `OAuth1` clients at a later date.


- A skip count operator to the rql builder `rqlBuilder().eq(name, '< value >').skipCount().build()`
  - Providing this operator skips the record counting step of a request to increase performance. As a result, the page object in a response will not include the total field.
  - The skip count operator is currently supported in [select services](https://docs.extrahorizon.com/extrahorizon/additional-resources/resource-query-language-rql#services-with-the-skip-count-rql-operator), and efforts are underway to make it available for all services.

### Fixed
- Documentation for an incorrect permission value of `exh.users.globalRoles.addPermissions()`
  - `REMOVE_ROLE_PERMISSIONS` to `REMOVE_ROLE_PERMISSION`

## [v7.6.0]

### Added
- `findAll`, `findAllIterator` and `update` methods to the Dispatcher service

### Improvements
- Updated types and documentation for the Dispatcher service
- Exported the missing `RQLString` type

## [v7.5.1]

### Added 
- Type support React Native form data

### Fixes
- Bumped Axios version to fix content-type header issue
- Fixed `onUploadProgress` callback event triggering without a provided function
- Removed discrimination between node and web environments

## [v7.5.0]

### Added

- Support for File Service settings:
  - File Service [settings](https://docs.extrahorizon.com/extrahorizon/services/manage-data/file-service#settings) may now be managed using methods found in:
    - `exh.files.settings`
    
## [v7.4.1]

### Fixes

- Correctly export the interfaces of the tasks component

## [v7.4.0]

### Added

- Support for API Functions:
  - An [API Function](https://docs.extrahorizon.com/extrahorizon/services/automation/task-service/api-functions) may now be executed using methods found in:
    - `exh.tasks.api`
  - [API Requests](https://docs.extrahorizon.com/extrahorizon/services/automation/task-service/api-functions#api-requests) produced by executing API Functions are accessible using methods found in:
    - `exh.tasks.apiRequests`
  - [API Request Logs](https://docs.extrahorizon.com/extrahorizon/services/automation/task-service/api-functions#api-request-logs) produced during the execution of an API Function can be accessed using methods found in:
    - `exh.tasks.apiRequests.logs`

  
- A Function may now be directly executed as a task using the method:
  - `exh.tasks.functions.execute()`


- Support for Tasks
  - Task Schedules may now be managed using methods found in:
    - `exh.tasks.schedules`
  - Task Logs produced during the execution of a task can now be accessed using methods found in:
    - `exh.tasks.logs`


- Monitoring File Uploads 
  - The SDK now supports [monitoring file uploads](https://docs.extrahorizon.com/extrahorizon/services/manage-data/file-service#monitoring-a-file-upload) in the browser using a callback function.
  ```js
  function uploadProgressCallback(event) {
      const progress = (event.loaded / event.total) * 100;
      // ... Do something with the progress value
  }
      
  const fileMetaData = await exh.files.create('myReport.pdf', myBuffer, {
      onUploadProgress: uploadProgressCallback,
      tags: ['ecg-report']
  });
  ```

### Changed

- `VIEW_GROUPS` permission value is changed to the correct `VIEW_GROUP`
- `ADD_ROLE_PERMISSION` is now described correctly as singular in the inline documentation
- Updated `RegisterUserData` interface optional fields

## [v7.3.0]

### Added

- Support for OpenID Connect
  - OAuth 2 clients now allow users to authenticate themselves with OpenID connect. See:
    - `exh.auth.generateOidcAuthenticationUrl()`
    - `exh.auth.authenticateWithOidc()`
  - Manage your OpenID Connect configuration via new methods found in:
    - `exh.auth.oidc`
    - `exh.auth.oidc.providers`
    - `exh.auth.oidc.loginAttempts`
- Methods to manage the User Service email templates:
  - `exh.users.getEmailTemplates()`
  - `exh.users.setEmailTemplates()`
- While creating an oAuth1 client both `token` and `tokenSecret` can now be supplied.
  In which case there is no need for an extra `exh.auth.authenticate` call.

```ts
const exh = createClient({
  host: 'https://api.example.extrahorizon.io',
  consumerKey: 'cf29b211b5030202ffce5b2510759d0a53ea5b17',
  consumerSecret: '9bd34e19b5e1714e2c57ae0127d98dd0d0c0b2a2',
  token: '409ce9ba49c56cce31b9d2b1b2f5ed5ac01b4011',
  tokenSecret: '1cc0b97b4c4721bb6da3d85b80cda8165e6ad5a7',
});

const currentUser = await sdk.users.me();
```

- While creating an oAuth2 client both `refreshToken` and `accessToken` can now be supplied.
  In which case there is no need for an extra `exh.auth.authenticate` call.

```ts
const exh = createClient({
  host: 'https://api.example.extrahorizon.io',
  clientId: 'f8d9c891c106131bec970c6da05f887dc82eaff7',
  refreshToken: 'ca27ada704e5b26a1fca20c130daf4f95f727d3f',
  accessToken: '019dc6fe1672176f28e8e894ba99aed1f49656c8',
});

const currentUser = await sdk.users.me();
```

### Changed
- Improved types and inline documentation (JSDoc) for the `exh.auth.applications` section
  - More detailed descriptions for the methods
  - Descriptions for the fields within the data types we accept and return

## [v7.2.1]

### Added

- Support large file uploads

### Fixes

- Task cancellation

## [v7.2.0]

### Added

- For API errors the `qName` variable is mapped to the `name` variable, to improve consistency with default errors.

### Fixes

- Corrected the interfaces to be consistent with the API
- Updated dead links in documentation

## [v7.1.0]

### Added

- `logout()` can now be performed on a proxy Client
- Tasks now take an optional generic to set the data type
- `userId` is now available on the raw mock

### Fixes

- The return type of `sdk.users.update()` is returning the correct `UserData`. See [issue #605](https://github.com/ExtraHorizon/javascript-sdk/issues/605)

## [v7.0.0]

### Added

- OAuth1 token management -> `sdk.auth.oauth1.getTokens` / `sdk.auth.oauth1.removeToken`. See [issue #465](https://github.com/ExtraHorizon/javascript-sdk/issues/465)
- Password policy -> `sdk.users.passwordPolicy` and `sdk.users.updatePasswordPolicy`
- Extra Playstore endpoint -> `payments.playStoreHistory.purchaseReceipts`
- Extra permissions for the updated task service
- RQL option to several endpoints

### Changed

- Types for the `sdk.auth.application.create` and `sdk.auth.application.createVersion` have been exported. See Authentication examples for more info.
- Pako to fflate
- Refactored the Schema and Document Types
- Updated the `EnlistmentConfiguration` type. See [issue #596](https://github.com/ExtraHorizon/javascript-sdk/issues/596)

### Fixes
- Running `yarn` on windows machines resulted in an error [issue #612](https://github.com/ExtraHorizon/javascript-sdk/issues/612)
- Return type of `sdk.auth.application.update` is now correctly typed as `AffectedRecords` 

### Breaking changes

- Removed `payments.playStoreHistory.purchases` (deprecated)
- The `contains` and `excludes` endpoints of the rql builder now accepts an array of expressions iso a single string. See [issue #603](https://github.com/ExtraHorizon/javascript-sdk/issues/603)
- The removal of the group roles now has the correct parameters

```diff
- sdk.users.groupRoles.remove(rql, groupId, roleId, options)
+ sdk.users.groupRoles.remove(rql, groupId, options)
```

## [v6.1.0]

### Breaking changes

- renamed `createTransaction` to `completeTransaction` on the payments.appStore service

```diff
- sdk.payments.appStore.createTransaction
+ sdk.payments.appStore.completeTransaction
```

### Changed

- When passing in `localhost` as host. No prefixing takes places.
- Fixed bug when calling `sdk.files.create` with tags as an array. See [PR #544](https://github.com/ExtraHorizon/javascript-sdk/pull/544)
- Properties on your JSONSchema on the data service will no longer have any automatic date parsing. [PR #546](https://github.com/ExtraHorizon/javascript-sdk/pull/546)
- If you are using the `sdk.raw` instance you can now pass in additional parameters to the http verbs. See [PR #546](https://github.com/ExtraHorizon/javascript-sdk/pull/546)

```ts
const result = sdk.raw.get('/files/v1', {
  interceptors: {
    skipCamelizeResponseData: true, // will recursively rename keys to camelCase
    skipTransformResponseData: true, // maps the values of certain keys to Dates
    skipTransformKeysResponseData: true, // renames certain keys for consistency
  },
});
```

- `Profile` type has been revised

```diff
-fibricheckInfo?: string;
+fibricheckInfo?: {
+  app?: {
+    version?: string;
+    build?: string;
+    branch?: string;
+  };
+  device?: {
+    os?: string;
+    model?: string;
+    type?: 'android' | 'ios';
+    manufacturer?: string;
+  };
+};
```

- `ProxyClient` existed double. One of those has been renamed to `ProxyInstance`

```diff
-export interface ProxyClient extends HttpInstance {
+export interface ProxyInstance extends HttpInstance {
```

## [v6.0.0]

### Breaking Changes

- `sdk.data.documents.create` now accepts 3 generics.

```diff
-create<CustomData = null, CustomStatus = null>(
- schemaId: ObjectId,
- requestBody: Record<string, any>,
- options?: OptionsWithRql & { gzip?: boolean }
-): Promise<Document<CustomData, CustomStatus>>;

+create<InputData = null, OutputData = null, CustomStatus = null>(
+ schemaId: ObjectId,
+ requestBody: InputData,
+ options?: OptionsWithRql & { gzip?: boolean }
+): Promise<Document<OutputData, CustomStatus>>;
```

### Added

- `sdk.data.documents.update` now accepts a generic for the update type.
- Exported `findAllGeneric` and `findAllIterator` for usage on raw functions
- Better type for `findAllIterator`

## [v5.3.1]

### Added/Fixed

- Playstore endpoints can handle rql now

## [v5.3.0]

### Added

- There are now 3 mocked exports. `getMockSdkProxy`, `getMockSdkOAuth2` and `getMockSdkOAuth1` with matching types. The `getMockSdk` is also still available and mapped to `getMockSdkOAuth2`.

## [v5.2.0]

### Added

- `btoa` function to be used when you are using React-Native in combination with a Confidential Application. See documentation for more info.
- `createOAuth1Client` and `createOAuth2Client` have had their type signatures updated. The `freshTokensCallback` will now have the correct type.
- Updated payments service to reflect v1.2.0 payments REST API
- `createProxyClient` is a new way to initialize the SDK using a proxy service.

### Changed

- `Comment` interface.

```diff
- userId
+ creatorId
+ commentedTimestamp
```

- `Document` interface now accepts an optional second parameter for the status property of the document. See [PR #461](https://github.com/ExtraHorizon/javascript-sdk/pull/461)
- Refactor of `userId` getter on the `sdk.raw` instance. It now works consistently everywhere (browser/node/react-native). See [PR #462](https://github.com/ExtraHorizon/javascript-sdk/pull/462)
- Added `findAll` and `findAllIterator` to notifications. The `find` method is also update to have pagination helpers [PR #475](https://github.com/ExtraHorizon/javascript-sdk/pull/475)

## [v5.1.0]

### Added

- `oauth1/ssoTokens/generate` and `oauth1/ssoTokens/consume` are added under the `sdk.auth.oauth1` scope. [More info](https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/SSO)

### Changes

- Calls not needing authentication are now correctly skipping this

```ts
sdk.users.createAccount();
sdk.users.requestPasswordReset();
sdk.users.requestEmailActivation();
sdk.users.isEmailAvailable();
```

## [v5.0.0]

### Breaking Changes

- The payments services has had some refactoring.

```diff
- sdk.payments.subscriptions.getEntitlements();
- sdk.payments.subscriptions.getEvents();
+ sdk.payments.subscriptions.entitlements.find();
+ sdk.payments.subscriptions.events.find();
```

```diff
- sdk.payments.appStoreSubscriptions.getSubscriptions();
- sdk.payments.appStoreSubscriptions.getSubscriptionsProducts();
+ sdk.payments.appStoreSubscriptioons.subscriptions.find();
+ sdk.payments.appStoreSubscriptioons.products.find();

- sdk.payments.appStoreSubscriptions.createSubscriptionsProduct();
- sdk.payments.appStoreSubscriptions.removeSubscriptionsProduct();
- sdk.payments.appStoreSubscriptions.updateSubscriptionsProduct();
+ sdk.payments.appStoreSubscriptions.products.create();
+ sdk.payments.appStoreSubscriptions.products.remove();
+ sdk.payments.appStoreSubscriptions.products.update();
```

### Added

- `parseGlobalPermissions` is a function to parse strings are return valid permissions

### Changed

- `userId` getter on the `OAuthClient` interface now returns a `Promise<string>` in stead of `string`. You can access this on `sdk.raw.userId`

## [v4.5.0]

### Added

- services that have a `findAll` method now also have `findAllIterator`.

```ts
const iterator = sdk.data.documents.findAllIterator('5a9552adcfd7f200016728d5');

for await (const page of iterator) {
  console.log(page); /* PagedResult<Document> */
}
```

- `sdk.data.schemas`, `sdk.data.documents` and `sdk.data.users` have had changes to their `find` function. This now returns the current value with two added functions `next()` and `previous()` which can be used to easily traverse the data.

```ts
const users = await sdk.users.find();

console.log('users,', users.page); // { total: 8268, offset: 0, limit: 20 }

console.log((await users.next()).page); // { total: 8268, offset: 20, limit: 20 }
console.log((await users.next()).page); // { total: 8268, offset: 40, limit: 20 }
console.log((await users.next()).page); // { total: 8268, offset: 60, limit: 20 }
console.log((await users.previous()).page); // { total: 8268, offset: 40, limit: 20 }
```

- rqlParser accepts a regular string which will be checked using the parser function and returns a valid RQLString.

### Changes

- added `endTimestamp` to list of fieldnames that are parsed at Date
- rqlBuilder now supports the `excludes` operator
- several examples had updates to reflect proper usage

## [v4.4.0]

### Changes

- Fixed `sdk.files.create` options types. See #352

```diff
-options?: OptionsBase & { tags: [] }
+options?: OptionsBase & { tags: string[] }
```

- JSDoc for `rqlBuilder().contains`. See #351

- GET requests returning a 500 status will be retried 4 more times at 300ms intervals. To disable this behaviour add `shouldRetry: false` to the options parameter. See #373

- `findAll` function added on users and data.documents. See #333

## [v4.3.0]

### Changes

- OAuth2 `authenticate` returns `tokenData`.
- OAuth2 `authenticate` can now be used with an authorization code. See Docs.
- OAuth2 supports confidentials applications.

```ts
const sdk = createClient({
  host: 'https://api.dev.fibricheck.com',
  clientId: '',
  clientSecret: '',
});
```

## [v4.2.1]

### Changes

- removed console.log in `sdk.data.documents.find` function

## [v4.2.0]

### Added

- Fixed documentation tables
- OAuth1 `authenticate` returns `tokenData`
- Updated documentation on SSL pinning
- Add `logout` function to `sdk.auth`
- Updated installation instructions
- Add `findAll` to `sdk.data.schemas`
- Client creation allows for extra headers which will be set on every call.

```ts
const sdk = createClient({
  host: 'https://api.dev.fibricheck.com',
  clientId: '',
  headers: {
    'X-Forwarded-Application': 'test',
  },
});
```

- Functions now accept options to set custom headers

```ts
await sdk.data.documents.create(
  '5f3511c7e9ae42283ae2eb29',
  {
    model: 'string',
  },
  { gzip: true, headers: { 'x-test': 'test' } }
);
```

## [v4.1.0]

### Added

- Added missing permissions
- Added findFirst method in users service

### Changes

- Fixed bug to show a clear error when the user is not authenticated
- Fixed documentation format
- Updated README installation

## [v4.0.0]

### Breaking Changes

- Updated rql parameter type. Is always `rql: RQLString` now. Functions affected:
  - sdk.payments.orders.addTagsToOrder
  - sdk.payments.orders.removeTagsFromOrder
  - sdk.payments.products.removeTagsFromProduct
- Updated parameter position if rql is a required parameter, it is always the first parameter. Functions affected
  - sdk.users.groupRoles.remove
  - sdk.users.groupRoles.removePermissions
  - sdk.users.groupRoles.removeFromStaff
  - sdk.users.groupRoles.removeUsersFromStaff
- Renamed all methods from `delete` to `remove` and all of them returning `AffectedRecords`
- Renamed all methods from `deleteFields` to `removeFields`

## [3.2.0]

### Added

- Localizations Service
- Profiles Service
- Notifications Service
- optional `skipTokenCheck` parameter to Oauth1 authentication flow with token/tokenSecret.
- Events Service

### Changes

- Fixed return types of `sdk.users.getStaff` and `sdk.users.getPatients`
- Updated docs links
- `updateProfileImage` method is deprecated
- Gzip option `sdk.data.documents.create`

```ts
await sdk.data.documents.create('schemaId', document, {
  gzip: true,
});
```

## [3.1.0]

### Breaking Changes

- `sdk.files.create` signature has changed.

```diff
- sdk.files.create({name: 'test.pdf', file: file, extension: 'pdf', tags: ['tag']);
+ sdk.files.create('test.pdf', file, {tags: ['tag]})
```

- Custom Document no longer need to extend from DocumentBase. You can just pass in the type for `data`

```diff
- interface CustomDocument extends DocumentBase {
- data: {
-    ppg: Number[];
-    location: {
-      longitude: Number;
-      latitude: Number;
-    };
-  };
- }
- const document = await sdk.data.documents.find<CustomDocument>();

+ interface MyData {
+   data: {
+     ppg: Number[];
+     location: {
+       longitude: Number;
+       latitude: Number;
+     };
+   };
+ }
+ const document = await sdk.data.documents.find<MyData>();
```

### Added

- `sdk.files.createFromText` where you can pass in your text directly.

```ts
await sdk.files.createFromText('this-is-a-string');
```

- Added `transitionsByName` getter to easily get the transition you need.

```ts
const {
  data: [schema],
} = await sdk.data.schemas.find();

const transition = schema.transitionsByName.lambda_to_review;
```

- Added `findTransitionIdByName` function on `schema` objects to easily find the transitionId you need.

```ts
const {
  data: [schema],
} = await sdk.data.schemas.find();

const transitionId = schema.findTransitionIdByName('lambda_to_review');
```

- Added `findById`, `findByName` and `findFirst` helpers to services having a generic `find` function.
- Payments Service
- Added `or`, `and` and `contains` operators to the RQL builder.

## [3.0.2]

### Breaking Changes

- `apiHost` has been renamed to `host` and should not include the protocol or `api` subdomain. Example `

```diff
+ const sdk = createClient({
+   host: 'dev.fibricheck.com',
+   consumerKey: '',
+   consumerSecret: '',
+ });
```

- `client` is renamed to `createClient`

```diff
- import { client } from '@extrahorizon/javascript-sdk';
+ import { createClient } from '@extrahorizon/javascript-sdk';
```

- `rawAxios` is renamed to `raw`

### Added

- `createOAuth1Client` and `createOAuth2Client` are now exported as more specifically typed versions of `createClient`
- Additional http header is added with every request. Which includes the package version and when running in node the node version.
- Added Test Reports
- `getMockSdk` function to get back a mocked SDK. See README for more info

### Changes

- Templates `resolveAsPdf` will return a `Buffer`
- `sdk.authenticate` now includes possible error responses in the JSDoc annotations
- `rqlBuilder` now has JSDoc annotations
- Fix for results with arrays containing strings
- File creation now correctly set the file name on the form-data. Accepts extra parameter `extension` which defaults to `pdf`
- The MailsService now correctly decamelizes the keys in the request

## [3.0.1]

### Changes

- Templates basepath fix

## [3.0.0]

### Breaking Changes

- Services scoping:

```diff
auth: {
- createApplication(),
- getApplications(),
- updateApplication(),
- deleteApplication(),
- createApplicationVersion(),
- deleteApplicationVersion(),
+ applications: {
+   create(),
+   get(),
+   update(),
+   delete(),
+   createVersion(),
+   deleteVersion(),
+ },
- createOauth2Authorization(),
- getOauth2Authorizations(),
- deleteOauth2Authorization(),
+ oauth2: {
+   createAuthorization(),
+   getAuthorizations(),
+   deleteAuthorization()
+ },
- getMfaSetting(),
- enableMfa(),
- disableMfa(),
- addMfaSetting(),
- confirmMfaMethodVerification(),
- removeMfaMethod(),
+ users: {
+   getMfaSetting(),
+   enableMfa(),
+   disableMfa(),
+   addMfaSetting(),
+   confirmMfaMethodVerification(),
+   removeMfaMethod()
+ }
},
data: {
- createSchema(),
- updateSchema(),
- deleteSchema(),
- enableSchema(),
- disableSchema(),
+ schemas: {
+   create(),
+   find(),
+   update(),
+   delete(),
+   enable(),
+   disable(),
+ },
- createIndex(),
- deleteIndex(),
+ indexes: {
+   create(),
+   delete(),
+ },
- createStatus(),
- updateStatus(),
- deleteStatus(),
+ statuses: {
+   create(),
+   update(),
+   delete(),
+ },
- createProperty(),
- deleteProperty(),
- updateProperty(),
+ properties: {
+   create(),
+   update(),
+   delete(),
+ },
- createComment(),
- findComments(),
- updateComment(),
- deleteComment(),
+ comments: {
+   create(),
+   find(),
+   update(),
+   delete(),
+ },
- createDocument(),
- findDocuments(),
- updateDocument(),
- deleteDocument(),
- deleteFieldsFromDocument(),
- transitionDocument(),
- linkGroupsToDocument(),
- unlinkGroupsFromDocument(),
- linkUsersToDocument(),
- unlinkUsersFromDocument(),
+ documents: {
+   create(),
+   find(),
+   update(),
+   delete(),
+   deleteFields(),
+   transition(),
+   linkGroups(),
+   unlinkGroups(),
+   linkUsers(),
+   unlinkUsers(),
+  },
- updateCreationTransition(),
- createTransition(),
- updateTransition(),
- deleteTransition()
+ transitions: {
+   updateCreation(),
+   create(),
+   update(),
+   delete(),
+ }
},
files: {
- createFile(),
- deleteFile(),
- retrieveFile(),
- retrieveFileStream(),
- getFileDetails(),
+ create(),
+ delete(),
+ retrieve(),
+ retrieveStream(),
+ getDetails(),
},
tasks: {
- createTask(),
- cancelTask(),
+ create(),
+ cancel(),
},
users: {
- getPermissions(),
- getRoles(),
- createRole(),
- deleteRole(),
- updateRole(),
- addPermissionsToRole(),
- removePermissionsFromRole(),
- addRolesToUsers(),
- removeRolesFromUsers(),
+ globalRoles: {
+   getPermissions(),
+   get(),
+   create(),
+   delete(),
+   update(),
+   addPermissions(),
+   removePermissions(),
+   addToUsers(),
+   removeFromUsers(),
+ },
- getGroupsPermissions(),
- getGroupsRoles(),
- addRoleToGroup(),
- updateGroupsRole(),
- removeRoleFromGroup(),
- addPermissionsToGroupRoles(),
- removePermissionsFromGroupRoles(),
- assignRolesToStaff(),
- removeRolesFromStaff(),
- addUsersToStaff(),
- removeUsersFromStaff(),
+ groupRoles: {
+   getPermissions(),
+   get(),
+   addRole(),
+   update(),
+   removeRole(),
+   addPermissions(),
+   removePermissions(),
+   assignToStaff(),
+   removeFromStaff(),
+   addUsersToStaff(),
+   removeUsersFromStaff(),
+ },
}
```

### Added

- Configurations Service
- Dispatchers Service
- Mails Service
- Templates Service

### Changes

- Types are now exposed within modules, so the usage will be:

```
import type { FilesServicesTypes: { CreateFile } }  from "@extrahorizon/javascript-sdk";
const inputFile: CreateFile = {}
```

- Error now not only extend from the `ApiError` class but also from their respective HTTP error code error. Possible errors are
  - 400: `BadRequestError`
  - 401: `UnauthorizedError`
  - 403: `ForbiddenError`
  - 404: `NotFoundError`
  - 500: `ServerError`
- PagedResults are now using generics
- Every merge into dev will create a tag and package with the current version number suffixed with `-dev.X` where X auto-increments
- Removed `* @throws {ApiError}` in JSDoc comments, only specific errors are mentioned when mentioned in the Swagger documentation

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
