# Migrating to V8.0.0

## Double encoding RQL values 
From version 8.0.0 RQL values are now [double encoded](https://docs.extrahorizon.com/extrahorizon/additional-resources/resource-query-language-rql#double-encoding-of-special-characters) by default when using the rql builder, to support the use of special characters in rql operations.

In your existing application it is likely that you have encoded values provided to the rql builder using methods such as `encodeURIComponent()`. To support the automatic double encoding of special characters, where applicable, these instances of encoding should be removed.
- Before 8.0.0: `rqlBuilder().eq('diagnosis', encodeURIComponent('Hypertension - STAGE 1'))`
- After 8.0.0: `rqlBuilder().eq('diagnosis', 'Hypertension - STAGE 1')`

Any use of an rql builder that does not need to support special characters may remain as it is.

### Reverting double encoding for a single rql builder
You may disable double encoding for an rql builder by setting the option `rqlBuilder({ doubleEncodeValues: false })`
- Before 8.0.0: `rqlBuilder().eq('diagnosis', encodeURIComponent('Hypertension - STAGE 1'))`
- After 8.0.0: `rqlBuilder({ doubleEncodeValues: false }).eq('diagnosis', encodeURIComponent('Hypertension - STAGE 1'))`

### Reverting double encoding for all rql builders
The automatic double encoding of values can be reverted to behavior before 8.0.0 using the snippet `rqlBuilder.doubleEncodeValues = false`. This should normally exist alongside the declaration of your Extra Horizon SDK instance at the root of your application.
- You may then enable double encoding for an rql builder `rqlBuilder({ doubleEncodeValues: true }).eq('diagnosis', 'Hypertension - STAGE 1')`
- You may manually encode values for an rql builder `rqlBuilder().eq('diagnosis', encodeURIComponent('Hypertension - STAGE 1'))`

For more information regarding manual double encoding please refer to the [RQL documentation](https://docs.extrahorizon.com/extrahorizon/additional-resources/resource-query-language-rql#double-encoding-of-special-characters).

## Custom data normalization
Prior to v8.0.0 all keys were normalized to snake_case in requests and camelCase in responses. This is useful because some of our services still return snake_case keys, while others return camelCase keys.
We wanted to keep this behaviour for all keys defined by Extra Horizon services, but we also wanted to allow custom keys to be sent and received as they are provided.

Starting from v8.0.0, the SDK will no longer normalize custom keys in requests and responses. This means that all custom keys will be sent and received as they are provided.

### Changes to request data
Prior to v8.0.0, when custom keys were supplied in camel case, they were internally stored in snake case. 
Starting from v8.0.0, custom keys are now preserved in the case provided in the input.

For all [affected properties](###-affected-properties) with the request mentioned in v8.0.0 the custom data in the request will now be stored as it was provided.

```js
// Setting the custom fields of a profile with a camel cased custom key
await exh.profiles.update(profile.id, {
    customFields: {
        helloWorld: 'test',
    },
});

// Before v8.0.0 the customFields of the profile would be stored as
// { 
//     hello_world: 'test' 
// }

// After v8.0.0 the customFields of the profile would be stored as
// {
//     helloWorld: 'test'
// }
```

### Changes to response data
For all [affected properties](###-affected-properties) with the response mentioned in v8.0.0 the custom data will be returned as it was provided from the services.

#### Camel Casing Custom Keys

Prior to v8.0.0, when custom keys were stored in snake case, you would receive them in camel case.
Starting from v8.0.0, custom keys are now preserved in the case provided in the input.

```js
// Setting the general configuration with a snake cased custom key
await exh.configurations.general.update({ 
  data: {
      enable_this_feature: true,
    }
});

// Retrieving the general configuration with the custom key
const configuration = await exh.configurations.general.find();


// Before v8.0.0 the custom key would be accessed as
configuration.data.enableThisFeature

// After v8.0.0 the custom key would be accessed as
configuration.data.enable_this_feature 
```

#### Dates

Prior to v8.0.0, when custom keys had `timestamp` in the name, they would be returned as Javascript date objects.
Starting from v8.0.0, custom keys are now preserved in the type provided in the input.
Except if you provide a date object, you will receive an ISO string.

```js
// Setting the general configuration with a snake cased custom key
await exh.configurations.general.update({ 
  data: {
      creationTimestamp: 1701870409000,
      expiryTimestamp: new Date(2023,11,6,13,46,49),
      updateTimestamp: '2023-11-06T13:46:49.000Z',
    }
});

// Retrieving the general configuration with the custom key
const configuration = await exh.configurations.general.find();


// Before v8.0.0 the data object in the response would be
// {
//     creationTimestamp: new Date(1701870409000), 
//     expiryTimestamp: new Date(2023,11,6,13,46,49), 
//     updateTimestamp: new Date('2023-11-06T13:46:49.000Z')
// }

// After v8.0.0 the data object in the response would be
// {
//     creationTimestamp: 1701870409000,
//     expiryTimestamp: '2023-11-06T13:46:49.000Z',
//     updateTimestamp: '2023-11-06T13:46:49.000Z',
// }
```

#### Records Affected

If you were providing custom keys with the name `records_affected` or `recordsAffected` they will now return as they are provided.
While before they would return as `affectedRecords`.

### Re-enable the request normalization of custom keys for a single operation
The normalization of custom keys can be re-enabled for a single operation to the behavior before 8.0.0 by setting the option `exh.service.operation({ normalizeCustomData: true })`
- Before 8.0.0: `exh.profiles.update(id, data, options)`
- After 8.0.0: `exh.profiles.update(id, data, {...options, normalizeCustomData: true ))`

### Re-enable the request normalization of custom keys for all operations on a client
The normalization of custom keys can be re-enabled for all operations on a client to the behavior before 8.0.0 using the snippet `exh = createClient({ ...options, normalizeCustomData: true });`.
- You may then disable normalization of custom keys for a single operation by  `exh.service.operation({ normalizeCustomData: false })`

### Affected Properties

These are the affected properties, listed by the relevant SDK method:

- `exh.configurations.find`
  - Response: `data`
  - Response: `userConfiguration`
  - Response: `groupConfiguration`
  - Response: `staffConfiguration`
  - Response: `patientConfiguration`
- `exh.configuration.groups.find`
  - Response: `data`
  - Response: `staff`
  - Response: `patientConfiguration`
- `exh.configurations.users.find`
  - Response: `data`
  - Response: `staffConfigurations.data`
  - Response: `patientConfigurations.data`
- `exh.dispatchers.actions.create`
  - Response: `data`
- `exh.dispatchers.get`
  - Response: `data.actions.data`
- `exh.dispatchers.create`
  - Response: `action.data`
- `exh.localizations.getByKeys`
  - Response: `ALL KEYS`
- `exh.mails.find`
  - Response: `data.content`
- `exh.mails.send`
  - Request & Response: `content`
- `exh.mails.findOutBound`
  - Response: `data.templateData.content`
- `exh.payments.orders.find`
  - Response: `data.data`
  - Response `data.product.schema.properties`
- `exh.payments.orders.create`
  - Response: `data`, 
  - Response: `product.schema.properties`
- `exh.payments.products.create`
  - Response `schema.properties`
- `exh.payments.products.find`
  - Response `data.schema.properties'`
- `exh.profiles.groups.create`
  - Request & Response: `customFields`
- `exh.profiles.groups.update`
  - Request & Response: `customFields`
- `exh.profiles.groups.removeFields`
  - Response: `customFields`
- `exh.profiles.create`
    - Request & Response: `customFields`
    - Request & Response: `groups.customFields`
- `exh.profiles.find`
    - Request & Response: `data.customFields`
    - Request & Response: `data.groups.customFields`
- `exh.profiles.update`
    - Request: `customFields`
    - Request: `groups.customFields`
- `exh.task.find`
  - Response: `data.data`
- `exh.tasks.create`
  - Response: `data`
- `exh.tasks.api.*`
    - Response: `ALL KEYS`
- `exh.tasks.functions`
  - Response: `data`
- `exh.tasks.schedules.find`
  - Response: `data.data`
- `exh.tasks.schedules.create`
  - Response: `data`
- `exh.templates.find`
  - Response: `schema.fields`
  - Response: `fields`
- `exh.templates.create`
  - Response: `schema.fields`
  - Response: `fields`
- `exh.templates.resolveAsJson`
  - Response: `ALL KEYS`
- `exh.templates.resolveAsJsonUsingCode`
  - Response: `ALL KEYS`

## Unauthenticated requests
For all [unauthenticated methods](#unauthenticated-methods), in v8.0.0 the response will now correctly undergo the same transformation steps as any other request.

Noticeably their timestamps previously returned as strings are now converted to date objects, the types of these methods have been updated to reflect this change.

### Unauthenticated Methods
- `exh.auth.authenticate`
- `exh.users.createAccount`
- `exh.auth.confirmMfa` for OAuth1 clients
