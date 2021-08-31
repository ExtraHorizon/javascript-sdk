import { OptionsWithRql, PagedResult } from './types';
import { rqlBuilder } from '../rql';

const MAX_LIMIT = 50;

export async function* findAllGenerator<T>(
  find: (options: OptionsWithRql) => PagedResult<T> | Promise<PagedResult<T>>,
  options: OptionsWithRql
): AsyncGenerator<T[]> {
  const mutableOptions = {
    rql:
      options?.rql && options.rql.includes('limit(')
        ? options.rql
        : rqlBuilder(options?.rql).limit(MAX_LIMIT).build(),
    ...options,
  };
  let result: PagedResult<T>;
  do {
    result = await find(mutableOptions);
    mutableOptions.rql = rqlBuilder(mutableOptions?.rql)
      .limit(result.page.limit, result.page.offset + result.page.limit)
      .build();
    yield result.data;
  } while (result.page.total > result.page.offset + result.page.limit);
  return [];
}

export async function findAllGeneric<T>(
  find: (options: OptionsWithRql) => PagedResult<T> | Promise<PagedResult<T>>,
  options: OptionsWithRql,
  level = 1
): Promise<T[]> {
  if (level === 1 && options?.rql && options.rql.includes('limit(')) {
    throw new Error('Do not pass in limit operator with findAll');
  }

  // return async options => {
  // Extra check is needed because this function is call recursively with updated RQL
  // But on the first run, we need to set the limit to the max to optimize
  const result: PagedResult<T> = await find({
    rql:
      options?.rql && options.rql.includes('limit(')
        ? options.rql
        : rqlBuilder(options?.rql).limit(MAX_LIMIT).build(),
  });

  if (result.page.total > 2000 && result.page.offset === 0) {
    console.warn(
      `WARNING: total amount is > 2000, be aware that this function can hog up resources. Total = ${result.page.total}`
    );
  }

  return result.page.total > result.page.offset + result.page.limit
    ? [
        ...result.data,
        ...(await findAllGeneric(
          find,
          {
            rql: rqlBuilder(options?.rql)
              .limit(result.page.limit, result.page.offset + result.page.limit)
              .build(),
          },
          level + 1
        )),
      ]
    : result.data;
}
