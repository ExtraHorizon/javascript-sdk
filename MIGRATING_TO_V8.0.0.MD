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

## Disabling custom key normalization

### Changes required in requests

For all affected properties with the request mentioned, check if you use any property names that are in `camelCase` and change them to `snake_case`.

Affected properties in requests had their keys transformed from camelCase to snake_case before sending it to the service.
An example would be all properties in the `customFields` property of the profile service. Updating this field with a value of
`{ 'helloWorld': 'test' }` would result in the value being stored as `{ 'hello_world': 'test' }`. 

### Changes required in  responses

For all affected properties with the response mentioned, check if you use any property names that are in `snake_case` and start addressing them as `snake_case` instead of `camelCase`.
This includes all properties that were normalized in the requests.

For all affected properties with the response mentioned, check if you use any property as if it is a date. If you do, transform it to a Date (`new Date(property)`) before using it. 

Affected properties in responses had their keys transformed from snake_case to camelCase before returning the data.
An example would be all properties in the `data` property of the configurations service. Returning a field with a value of
`{ 'hello_world': 'test' }` would result in the value being retrieved as `{ 'helloWorld': 'test' }`.

Timestamps in responses of affected properties were sometimes converted to an actual javascript data object. 
They will now always come as what was provided in the request. If a property was provided as Date, it will be returned as a string.

### Reverting to request normalization of custom keys for a single operation
You may enable normalization of custom keys by setting the option `sdk.service.operation({ normalizeCustomData: true })`
- Before 8.0.0: `sdk.profiles.update(id, data, options)`
- After 8.0.0: `sdk.profiles.update(id, data, {...options, normalizeCustomData: true ))`

### Reverting to request normalization of custom keys for all operation a client
The normalization of custom keys can be reverted to behavior before 8.0.0 using the snippet `sdk = createClient({ ...options, normalizeCustomData: true });`.
- You may then disable normalization of custom keys for a single operation by  `sdk.service.operation({ normalizeCustomData: false })`

### Affected Properties

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
    - Response: `ALL`
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
  - Response: `*`
- `sdk.templates.resolveAsJsonUsingCode`
  - Response: `*`
