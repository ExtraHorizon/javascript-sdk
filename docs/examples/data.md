## Find the schema with name `tests` and only select id, name and transitions

```js
const schema = await sdk.data.schemas.findByName('tests', {
  rql: rqlBuilder().select(['id', 'name', 'transitions']).build(),
});

console.log(schema.transitions);
// [{ id: '1', name:'trans1' }, { id: '1', name: 'trans2'}]

console.log(schema.transitionsByName);
/* {
  trans1: {
    id: '1',
    name: 'trans1'
  },
  trans2: {
    id: '2',
    name: 'trans2'
  }
} */
```

## Find a document with custom data typing:

```ts
const schema = await sdk.data.schemas.findFirst();

interface MyData {
  ppg: Number[];
  location: {
    longitude: Number;
    latitude: Number;
  };
}
const document = await sdk.data.documents.find<MyData>(schema.id);

console.log(document.data.ppg);
```

## Transition a document based on `data.deviceUid`

```js
const schema = await sdk.data.schemas.findByName('tests', {
  rql: rqlBuilder().select(['id', 'name', 'transitions']).build(),
});

const document = await sdk.data.documents.findFirst(schema.id, {
  rql: rqlBuilder().eq('data.deviceUid', 'testkit').build(),
});

const transitionId = schema.findTransitionIdByName('ready_to_waiting');

const transitionResult = await sdk.data.documents.transition(
  schema.id,
  document.id,
  {
    id: transitionId,
    data: { result: 'true' },
  }
);

if (transitionResult.affectedRecords === 1) {
  console.log('transition succesful');
}
```

## Find all schemas

```js
const schemas = await sdk.data.schemas.findAll({
  rql: rqlBuilder().select(['id', 'name']).build(),
});
```

## Find all schemas with generator

More info on [Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)

```js
const schemaGenerator = sdk.data.schemas.findAllGenerator({
  rql: rqlBuilder().select(['id', 'name']).build(),
});

const firstBatch = await generator.next();

console.log(firstBatch.value); // [...] Array containing first 50 items
```

```js
const schemaGenerator = sdk.data.schemas.findAllGenerator({
  rql: rqlBuilder().select(['id', 'name']).build(),
});

for await (const page of schemaGenerator) {
  console.log(page.length);
}
```

## Find with pagination

For Schema, Documents and Users the `find` function returns and object with the initial data and two helpers function to get the previous / next page.

```js
const users = await sdk.users.find();

const nextPage = await users.next();
const previousPage = await users.previous();
```
