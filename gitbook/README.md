---
description: Getting started with the ExtraHorizon Javascript SDK
---

# Getting Started

This package serves as a JavaScript wrapper around all [Extra Horizon](https://www.extrahorizon.com/cloud-services) cloud services providing you with fast and easy way to integrate with the Extra Horizon platform.

## Installation

Using npm:

```
npm install @extrahorizon/javascript-sdk
```

Using yarn:

```
yarn add @extrahorizon/javascript-sdk
```

### Quick start

Please see [authentication examples](v7/setup/broken-reference/) for more options.

```ts
import { createOAuth2Client } from "@extrahorizon/javascript-sdk";

(async () => {
  const exh = createOAuth2Client({
    host: "",
    clientId: "",
  });

  await exh.auth.authenticate({
    password: "",
    username: "",
  });

  console.log("exh.users.me()", await exh.users.me());
})();
```

### Features

* [Auth](https://docs.extrahorizon.com/extrahorizon/services/access-management/auth-service): Provides authentication functionality. The Authentication service supports both OAuth 1.0a and OAuth 2.0 standards.
* [Users](https://docs.extrahorizon.com/extrahorizon/services/access-management/user-service): The user service stands in for managing users themselves, as well as roles related to users and groups of users.
* [Data](https://docs.extrahorizon.com/extrahorizon/services/manage-data): A flexible data storage for structured data. Additionally, the service enables you to configure a state machine for instances of the structured data. You can couple actions that need to be triggered by the state machine, when/as the entities (instance of structured data) change their state. Thanks to these actions you can define automation rules (see later for more in depth description). These actions also make it possible to interact with other services.
* [Files](https://docs.extrahorizon.com/extrahorizon/services/manage-data/file-service): A service that handles file storage, metadata & file retrieval based on tokens.
* [Tasks](https://docs.extrahorizon.com/extrahorizon/services/automation/task-service): Start functions on demand, directly or at a future moment.
* [Templates: ](https://docs.extrahorizon.com/extrahorizon/services/other/template-service)The template service manages templates used to build emails. It can be used to retrieve, create, update or delete templates as well as resolving them.
* [Mails:](https://docs.extrahorizon.com/extrahorizon/services/communication/mail-service) Provides mail functionality for other services.
* [Configurations:](https://docs.extrahorizon.com/extrahorizon/services/other/configurations-service) Provides storage for custom configuration objects. On different levels (general, groups, users, links between groups and users).
* [Dispatchers:](https://docs.extrahorizon.com/extrahorizon/services/automation/dispatchers-service) Configure actions that need to be invoked when a specific event is/was triggered.
* [Payments:](https://docs.extrahorizon.com/extrahorizon/services/other/payments-service) A service that provides payment functionality.
* [Profiles](https://docs.extrahorizon.com/profile-service/): Storage service of profiles. A profile is a separate object on its own, comprising medical information like medication and medical history, as well as technical information, like what phone a user is using.
* [Notifications:](https://docs.extrahorizon.com/extrahorizon/services/communication/notification-service) A service that handles push notifications.
* [Localizations:](https://docs.extrahorizon.com/extrahorizon/services/other/localizations-service) Storage and retrieval of text snippets, translated into multiple languages.
* [Events:](https://docs.extrahorizon.com/extrahorizon/services/automation/event-service) Service that provides event (publish/subscribe) functionality for other services.

### 🔑 License

The MIT License (MIT). Please see [License File](https://github.com/ExtraHorizon/javascript-sdk/blob/dev/LICENSE) for more information.
