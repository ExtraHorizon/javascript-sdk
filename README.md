[![Quality assurance](https://github.com/ExtraHorizon/javascript-sdk/actions/workflows/qualilty-assurance.yml/badge.svg?branch=master)](https://github.com/ExtraHorizon/javascript-sdk/actions/workflows/qualilty-assurance.yml)
[![Code style](https://github.com/ExtraHorizon/javascript-sdk/actions/workflows/code-style.yml/badge.svg?branch=master)](https://github.com/ExtraHorizon/javascript-sdk/actions/workflows/code-style.yml)

# Extrahorizon Javascript SDK

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

```js
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

## Interceptors

The data returned from the backend is mapped using interceptors:

- Timestamps will be of type Date
- Keys in objects will be camelCased
- `records_affected` will be replaced by `affected_records`

## 🔑 License

The MIT License (MIT). Please see [License File](/LICENSE) for more information.

[auth]: https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/
[users]: https://developers.extrahorizon.io/services/users-service/1.1.7/
[data]: https://developers.extrahorizon.io/services/data-service/1.0.9/
[files]: https://developers.extrahorizon.io/services/files-service/1.0.1-dev/
[tasks]: https://developers.extrahorizon.io/services/tasks-service/1.0.4/
[templates]: https://developers.extrahorizon.io/services/templates-service/1.0.13/
[mails]: https://developers.extrahorizon.io/services/mail-service/1.0.8-dev/
[configurations]: https://developers.extrahorizon.io/services/configurations-service/2.0.2-dev/
[dispatchers]: https://developers.extrahorizon.io/services/dispatchers-service/1.0.3-dev/
[payments]: https://developers.extrahorizon.io/services/payments-service/1.1.0-dev/
[profiles]: https://developers.extrahorizon.io/services/profiles-service/1.1.3/
[notifications]: https://developers.extrahorizon.io/services/notifications-service/1.0.8/
[localizations]: https://developers.extrahorizon.io/services/localizations-service/1.1.6-dev/
