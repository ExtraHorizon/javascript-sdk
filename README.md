# Extra Horizon JavaScript SDK

This package serves as a JavaScript wrapper around all [Extra Horizon](https://www.extrahorizon.com/cloud-services) cloud services.

## Features

- [Auth][auth]: Provides authentication functionality. The Authentication service supports both OAuth 1.0a and OAuth 2.0 standards.
- [Users][users]: The user service stands in for managing users themselves, as well as roles related to users and groups of users.
- [Data][data]: A flexible data storage for structured data. Additionally, the service enables you to configure a state machine for instances of the structured data. You can couple actions that need to be triggered by the state machine, when/as the entities (instance of structured data) change their state. Thanks to these actions you can define automation rules (see later for more in depth description). These actions also make it possible to interact with other services.
- [Files][files]: A service that handles file storage, metadata & file retrieval based on tokens.
- [Tasks][tasks]: Start functions on demand, directly or at a future moment.
- [Templates][templates]: The template service manages templates used to build emails. It can be used to retrieve, create, update or delete templates as well as resolving them.
- [Mails][mails]: Provides mail functionality for other services.
- [Configurations][configurations]: Provides storage for custom configuration objects. On different levels (general, groups, users, links between groups and users).
- [Dispatchers][dispatchers]: Configure actions that need to be invoked when a specific event is/was triggered.
- [Payments][payments]: A service that provides payment functionality.
- [Profiles][profiles]: Storage service of profiles. A profile is a separate object on its own, comprising medical information like medication and medical history, as well as technical information, like what phone a user is using.
- [Notifications][notifications]: A service that handles push notifications.
- [Localizations][localizations]: Storage and retrieval of text snippets, translated into multiple languages.
- [Events][events]: Service that provides event (publish/subscribe) functionality for other services.

## Getting started

To get started with the ExtraHorizon SDK you'll need to install it, and then get credentials which will allow you to access the backend.

## Installation

Using npm:

```sh
npm install @extrahorizon/javascript-sdk
```

Using yarn:

```sh
yarn add @extrahorizon/javascript-sdk
```

## Quick Start

```ts
import { createOAuth2Client } from '@extrahorizon/javascript-sdk';

(async () => {
  const exh = createOAuth2Client({
    host: '',
    clientId: '',
  });

  await exh.auth.authenticate({
    password: '',
    username: '',
  });

  console.log('exh.users.health()', await exh.users.health());
  console.log('exh.users.me()', await exh.users.me());
})();
```

Please see [authentication examples](https://extrahorizon.github.io/javascript-sdk/#/docs/examples/authentication) for more options.

## Interceptors

The data returned from the backend is mapped using interceptors:

- Timestamps will be of type Date
- Keys in objects will be camelCased
- `records_affected` will be replaced by `affected_records`

## Documentation

- [https://docs.extrahorizon.com/javascript-sdk/](https://docs.extrahorizon.com/javascript-sdk/)

## 🔑 License

The MIT License (MIT). Please see [License File](/LICENSE) for more information.

## Developer Notes

Throughout the different services we use `this` for easy access to other functions in each service. The usage of `this` as first parameter is explained here: https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function. This parameter is excluded from all exported types.

```ts
find(
  this: DataSchemasService,
  options?: { rql?: RQLString }
): Promise<PagedResult<Schema>>;
```

## Migration Guides
[Migrating to v8.0.0](MIGRATING_TO_V8.0.0.MD)

## Swagger files

[auth]: https://swagger.extrahorizon.com/listing/?service=auth-service&redirectToVersion=2
[users]: https://swagger.extrahorizon.com/listing/?service=users-service&redirectToVersion=1
[data]: https://swagger.extrahorizon.com/listing/?service=data-service&redirectToVersion=1
[files]: https://swagger.extrahorizon.com/listing/?service=files-service&redirectToVersion=1
[tasks]: https://swagger.extrahorizon.com/listing/?service=tasks-service&redirectToVersion=1
[templates]: https://swagger.extrahorizon.com/listing/?service=templates-service&redirectToVersion=1
[mails]: https://swagger.extrahorizon.com/listing/?service=mail-service&redirectToVersion=1
[configurations]: https://swagger.extrahorizon.com/listing/?service=configurations-service&redirectToVersion=2
[dispatchers]: https://swagger.extrahorizon.com/listing/?service=dispatchers-service&redirectToVersion=1
[payments]: https://swagger.extrahorizon.com/listing/?service=payments-service&redirectToVersion=1
[profiles]: https://swagger.extrahorizon.com/listing/?service=profiles-service&redirectToVersion=1
[notifications]: https://swagger.extrahorizon.com/listing/?service=notifications-service&redirectToVersion=1
[localizations]: https://swagger.extrahorizon.com/listing/?service=localizations-service&redirectToVersion=1
[events]: https://swagger.extrahorizon.com/listing/?service=events-service&redirectToVersion=1
