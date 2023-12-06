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

From version 8.0.0, the SDK will no longer normalize custom keys in requests and responses. This means that all custom keys will be sent and received as they are provided.

Before version 8.0.0 all keys were normalized to snake_case in requests and camelCase in responses. This is useful because some of our services still return snake_case keys, while others return camelCase keys. 
We wanted to keep this behaviour for all keys defined by Extra Horizon services, but we also wanted to allow custom keys to be sent and received as they are provided.

### Changes to request data
If you are providing custom keys in camel case before v8.0.0, they will now be stored as camel case.
While before they would be stored as snake case for some requests.

For all [affected properties](###-affected-properties) with the request mentioned in v8.0.0 the custom data in the request will be stored as it was provided.

Before v8.0.0 some custom data in requests was transformed to snake case:
```js
// Setting the custom fields of a profile with a camel cased custom key
await sdk.profiles.update(profile.id, {
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
For all [affected properties](###-affected-properties) with the response mentioned in v8.0.0 the response will be returned as it was provided.

#### Camel Casing Custom Keys

If you are providing custom keys in snake case, you will now receive them as snake case in the responses as well.
While before you would receive them as camel case.

Before v8.0.0 some responses used to be camel cased:
```js
// Setting the general configuration with a snake cased custom key
await sdk.configurations.general.update({ 
  data: {
      enable_this_feature: true,
    }
});

// Retrieving the general configuration with the custom key
const configuration = await sdk.configurations.general.find();


// Before v8.0.0 the custom key would be accessed as
configuration.data.enableThisFeature

// After v8.0.0 the custom key would be accessed as
configuration.data.enable_this_feature 
```

#### Dates

If you are providing custom keys with timestamp in the name, they will now not return as Javascript date objects anymore.
You will now receive them as what was provided in the request.
Except if you provide a date object, you will receive an iso string.

Before v8.0.0 some timestamps in responses were returned as Javascript date objects:

```js
// Setting the general configuration with a snake cased custom key
await sdk.configurations.general.update({ 
  data: {
      creationTimestamp: 0,
      expiryTimestamp: new Date(2012,0,1),
      updateTimestamp: '2010-02-05T00:00:00.000Z',
    }
});

// Retrieving the general configuration with the custom key
const configuration = await sdk.configurations.general.find();


// Before v8.0.0 the data object in the response would be
// {
//     creationTimestamp: new Date(0), 
//     expiryTimestamp: new Date(2012,0,1), 
//     updateTimestamp: new Date('2010-02-05T00:00:00.000Z')
// }

// After v8.0.0 the data object in the response would be
// {
//     creationTimestamp: 0,
//     expiryTimestamp: '2012-01-01T00:00:00.000Z',
//     updateTimestamp: '2010-02-05T00:00:00.000Z',
// }
```

#### Records Affected

If you were providing custom keys with the name `records_affected` or `recordsAffected` they will now return as they are provided.
While before they would return as `affectedRecords`.

### Reverting to request normalization of custom keys for a single operation
You may enable normalization of custom keys by setting the option `sdk.service.operation({ normalizeCustomData: true })`
- Before 8.0.0: `sdk.profiles.update(id, data, options)`
- After 8.0.0: `sdk.profiles.update(id, data, {...options, normalizeCustomData: true ))`

### Reverting to request normalization of custom keys for all operation a client
The normalization of custom keys can be reverted to behavior before 8.0.0 using the snippet `sdk = createClient({ ...options, normalizeCustomData: true });`.
- You may then disable normalization of custom keys for a single operation by  `sdk.service.operation({ normalizeCustomData: false })`

### Affected Properties

These are the affected properties, listed by the relevant SDK method:

- `sdk.configurations.find`
  - Response: `data`
  - Response: `userConfiguration`
  - Response: `groupConfiguration`
  - Response: `staffConfiguration`
  - Response: `patientConfiguration`
- `sdk.configuration.groups.find`
  - Response: `data`
  - Response: `staff`
  - Response: `patientConfiguration`
- `sdk.configurations.users.find`
  - Response: `data`
  - Response: `staffConfigurations.data`
  - Response: `patientConfigurations.data`
- `sdk.dispatchers.actions.create`
  - Response: `data`
- `sdk.dispatchers.get`
  - Response: `data.actions.data`
- `sdk.dispatchers.create`
  - Response: `action.data`
- `sdk.localizations.getByKeys`
  - Response: `ALL KEYS`
- `sdk.mails.find`
  - Response: `data.content`
- `sdk.mails.send`
  - Request & Response: `content`
- `sdk.mails.findOutBound`
  - Response: `data.templateData.content`
- `sdk.payments.orders.find`
  - Response: `data.data`
  - Response `data.product.schema.properties`
- `sdk.payments.orders.create`
  - Response: `data`, 
  - Response: `product.schema.properties`
- `sdk.payments.products.create`
  - Response `schema.properties`
- `sdk.payments.products.find`
  - Response `data.schema.properties'`
- `sdk.profiles.groups.create`
  - Request & Response: `customFields`
- `sdk.profiles.groups.update`
  - Request & Response: `customFields`
- `sdk.profiles.groups.removeFields`
  - Response: `customFields`
- `sdk.profiles.create`
    - Request & Response: `customFields`
    - Request & Response: `groups.customFields`
- `sdk.profiles.find`
    - Request & Response: `data.customFields`
    - Request & Response: `data.groups.customFields`
- `sdk.profiles.update`
    - Request: `customFields`
    - Request: `groups.customFields`
- `sdk.task.find`
  - Response: `data.data`
- `sdk.tasks.create`
  - Response: `data`
- `sdk.tasks.api.*`
    - Response: `ALL KEYS`
- `sdk.tasks.functions`
  - Response: `data`
- `sdk.tasks.schedules.find`
  - Response: `data.data`
- `sdk.tasks.schedules.create`
  - Response: `data`
- `sdk.templates.find`
  - Response: `schema.fields`
  - Response: `fields`
- `sdk.templates.create`
  - Response: `schema.fields`
  - Response: `fields`
- `sdk.templates.resolveAsJson`
  - Response: `ALL KEYS`
- `sdk.templates.resolveAsJsonUsingCode`
  - Response: `ALL KEYS`
