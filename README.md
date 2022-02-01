# Home

[![Quality assurance](https://github.com/ExtraHorizon/javascript-sdk/actions/workflows/qualilty-assurance.yml/badge.svg?branch=master)](https://github.com/ExtraHorizon/javascript-sdk/actions/workflows/qualilty-assurance.yml) [![Code style](https://github.com/ExtraHorizon/javascript-sdk/actions/workflows/code-style.yml/badge.svg?branch=master)](https://github.com/ExtraHorizon/javascript-sdk/actions/workflows/code-style.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/baa71ad27c3ce167cd7d/maintainability)](https://codeclimate.com/github/ExtraHorizon/javascript-sdk/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/baa71ad27c3ce167cd7d/test\_coverage)](https://codeclimate.com/github/ExtraHorizon/javascript-sdk/test\_coverage)

## Extra Horizon JavaScript SDK

This package serves as a JavaScript wrapper around all [Extra Horizon](https://www.extrahorizon.com/cloud-services) cloud services.

### Features

{% content-ref url="https://app.gitbook.com/o/-MkCjSW-Ht0-VBM7yuP9/s/shlQh9HtXZI8Mk4PQbAj/" %}
[v2](https://app.gitbook.com/o/-MkCjSW-Ht0-VBM7yuP9/s/shlQh9HtXZI8Mk4PQbAj/)
{% endcontent-ref %}



* [Auth](https://docs.extrahorizon.com/auth-service/): Provides authentication functionality. The Authentication service supports both OAuth 1.0a and OAuth 2.0 standards.
* [Users](https://docs.extrahorizon.com/user-service/): The user service stands in for managing users themselves, as well as roles related to users and groups of users.
* [Data](https://docs.extrahorizon.com/data-service/): A flexible data storage for structured data. Additionally, the service enables you to configure a state machine for instances of the structured data. You can couple actions that need to be triggered by the state machine, when/as the entities (instance of structured data) change their state. Thanks to these actions you can define automation rules (see later for more in depth description). These actions also make it possible to interact with other services.
* [Files](https://docs.extrahorizon.com/data-service/): A service that handles file storage, metadata & file retrieval based on tokens.
* [Tasks](https://docs.extrahorizon.com/file-service/): Start functions on demand, directly or at a future moment.
* [Templates](https://docs.extrahorizon.com/template-service/): The template service manages templates used to build emails. It can be used to retrieve, create, update or delete templates as well as resolving them.
* [Mails](https://docs.extrahorizon.com/mail-service/): Provides mail functionality for other services.
* [Configurations](https://docs.extrahorizon.com/configuration-service/): Provides storage for custom configuration objects. On different levels (general, groups, users, links between groups and users).
* [Dispatchers](https://docs.extrahorizon.com/dispatcher-service/): Configure actions that need to be invoked when a specific event is/was triggered.
* [Payments](https://docs.extrahorizon.com/payment-service/): A service that provides payment functionality.
* [Profiles](https://docs.extrahorizon.com/profile-service/): Storage service of profiles. A profile is a separate object on its own, comprising medical information like medication and medical history, as well as technical information, like what phone a user is using.
* [Notifications](https://docs.extrahorizon.com/notification-service/): A service that handles push notifications.
* [Localizations](https://docs.extrahorizon.com/localization-service/): Storage and retrieval of text snippets, translated into multiple languages.
* [Events](https://docs.extrahorizon.com/event-service/): Service that provides event (publish/subscribe) functionality for other services.

### Getting started

To get started with the ExtraHorizon SDK you'll need to install it, and then get credentials which will allow you to access the backend.

### Installation

In your project, if you are using yarn or npm you need to create a file called `.npmrc` at the root level of your project and add these lines. Replace ${AUTH\_TOKEN} with your personal access token. You can get a new one at https://github.com/settings/tokens/new. Make sure you enable the `read:packages` scope.

```
@extrahorizon:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${AUTH_TOKEN}
```

Alternatively, this file can be added/edited in your home directory and it will be applied to all projects.

Explanation from GitHub on how to add your token can be found here https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages

Using npm:

```
npm install @extrahorizon/javascript-sdk
```

Using yarn:

```
yarn add @extrahorizon/javascript-sdk
```

### Quick Start

```ts
import { createOAuth2Client } from '@extrahorizon/javascript-sdk';

(async () => {
  const sdk = createOAuth2Client({
    host: '',
    clientId: '',
  });

  await sdk.auth.authenticate({
    password: '',
    username: '',
  });

  console.log('sdk.users.health()', await sdk.users.health());
  console.log('sdk.users.me()', await sdk.users.me());
})();
```

Please see [authentication examples](https://extrahorizon.github.io/javascript-sdk/#/docs/examples/authentication) for more options.

### Interceptors

The data returned from the backend is mapped using interceptors:

* Timestamps will be of type Date
* Keys in objects will be camelCased
* `records_affected` will be replaced by `affected_records`

### Documentation

* [https://extrahorizon.github.io/javascript-sdk](https://extrahorizon.github.io/javascript-sdk)

### 🔑 License

The MIT License (MIT). Please see [License File](LICENSE/) for more information.

### Developer Notes

Throughout the different services we use `this` for easy access to other functions in each service. The usage of `this` as first parameter is explained here: https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function. This parameter is excluded from all exported types.

```ts
find(
  this: DataSchemasService,
  options?: { rql?: RQLString }
): Promise<PagedResult<Schema>>;
```
