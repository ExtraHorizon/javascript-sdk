## Find the schema with name `tests` and only select id, name and transitions

```ts
const schema = await sdk.data.schemas.findByName("tests", {
  rql: rqlBuilder().select(["id", "name", "transitions"]).build(),
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

```ts
const schema = await sdk.data.schemas.findByName("tests", {
  rql: rqlBuilder().select(["id", "name", "transitions"]).build(),
});

const document = await sdk.data.documents.findFirst(schema.id, {
  rql: rqlBuilder().eq("data.deviceUid", "testkit").build(),
});

const transitionId = schema.findTransitionIdByName("ready_to_waiting");

const transitionResult = await sdk.data.documents.transition(
  schema.id,
  document.id,
  {
    id: transitionId,
    data: { result: "true" },
  }
);

if (transitionResult.affectedRecords === 1) {
  console.log("transition succesful");
}
```

## Find all schemas

```ts
const schemas = await sdk.data.schemas.findAll({
  rql: rqlBuilder().select(["id", "name"]).build(),
});
```

## Find all schemas with Iterator

More info on [Iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol)

```ts
const schemaIterator = sdk.data.schemas.findAllIterator({
  rql: rqlBuilder().select(["id", "name"]).build(),
}); // Let's assume there are 66 schemas

const firstBatch = await schemaIterator.next();
const secondBatch = await schemaIterator.next();
const thirdBatch = await schemaIterator.next();

console.log(firstBatch); // { value: PagedResult with 50 schemas, done: false }
console.log(secondBatch); // { value: PagedResult with 16 schemas, done: false }
console.log(thirdBatch); // { value: undefined, done: true }
```

```ts
const schemas = sdk.data.schemas.findAllIterator({
  rql: rqlBuilder().select(["id", "name"]).build(),
});

for await (const schema of schemas) {
  console.log(schema); /* PagedResult<Schema> */
}
```

## Custom Iterator

```ts
interface YourType {}

const endpoint = "";

const rql = RqlBuilder().eq("userId", userId);

const find = (options: OptionsWithRql) => {
  return await sdk.raw.get(`${endpoint}${options?.rql}`);
};

const iterator = findAllIterator<YourType>(find, { rql });

for await (const value of iterator) {
  console.log(value); /* PagedResult<YourType> */
}
```

## Find with pagination

For Schema, Documents and Users the `find` function returns and object with the initial data and two helpers function to get the previous / next page.

```ts
const users = await sdk.users.find();

const nextPage = await users.next();
const previousPage = await users.previous();
```

Or if you are using the [Async](https://caolan.github.io/async/v3/index.html) package.

```ts
import async from "async";

const users = await sdk.users.find();

await async.timesLimit(5, 1, async function () {
  const batch = await users.next();
  console.log("batch", batch.page, batch.data.length);
});

async.timesLimit(8, 1, async function () {
  const batch = await users.previous();
  console.log("batch", batch.page, batch.data.length);
});
```

You can also pass in an offset (for example when you were processing items and something went wrong and want to resume where you left off)

```ts
import async from "async";

const users = await sdk.users.find();
const currentOffset = 0;
await async.timesLimit(5, 1, async function () {
  const batch = await users.next();
  currentOffset = batch.page.offset;
});

const usersWithOffset = await sdk.users.find({
  rql: rqlBuilder().limit(50, currentOffset).build(),
});

console.log(usersWithOffset.page.offset); // 100

await async.timesLimit(5, 1, async function () {
  const batch = await usersWithOffset.next();
  console.log(batch.page.offset); // 150 -> 200 -> 250 -> 300 -> 350
});
```
