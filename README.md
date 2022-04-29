---
description: Getting started with the ExtraHorizon Javascript SDK
---

# Getting Started

[![Quality assurance](https://github.com/ExtraHorizon/javascript-sdk/actions/workflows/qualilty-assurance.yml/badge.svg?branch=master)](https://github.com/ExtraHorizon/javascript-sdk/actions/workflows/qualilty-assurance.yml) [![Code style](https://github.com/ExtraHorizon/javascript-sdk/actions/workflows/code-style.yml/badge.svg?branch=master)](https://github.com/ExtraHorizon/javascript-sdk/actions/workflows/code-style.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/baa71ad27c3ce167cd7d/maintainability)](https://codeclimate.com/github/ExtraHorizon/javascript-sdk/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/baa71ad27c3ce167cd7d/test\_coverage)](https://codeclimate.com/github/ExtraHorizon/javascript-sdk/test\_coverage)

This package serves as a JavaScript wrapper around all [Extra Horizon](https://www.extrahorizon.com/cloud-services) cloud services providing you with fast and easy way to integrate with the Extra Horizon platform.

* [Installation](setup/installation.md)
* [Quick start](setup/start.md)

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

### Interceptors

The data returned from the backend is mapped using interceptors:

* Timestamps will be of type Date
* Keys in objects will be camelCased
* `records_affected` will be replaced by `affected_records`

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
