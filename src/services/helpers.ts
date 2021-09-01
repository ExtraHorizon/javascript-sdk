import { OptionsWithRql, PagedResult, PagedResultWithPager } from './types';
import { rqlBuilder } from '../rql';

const MAX_LIMIT = 50;

export async function* findAllGenerator<T>(
  find: (options: OptionsWithRql) => PagedResult<T> | Promise<PagedResult<T>>,
  options: OptionsWithRql
): AsyncGenerator<T[]> {
  async function* makeRequest(requestOptions: OptionsWithRql) {
    const result = await find(requestOptions);
    yield result.data;

    if (result.page.total > result.page.offset + result.page.limit) {
      yield* makeRequest({
        ...requestOptions,
        rql: rqlBuilder(requestOptions?.rql)
          .limit(result.page.limit, result.page.offset + result.page.limit)
          .build(),
      });
    }
  }

  yield* makeRequest({
    rql:
      options?.rql && options.rql.includes('limit(')
        ? options.rql
        : rqlBuilder(options?.rql).limit(MAX_LIMIT).build(),
    ...options,
  });
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

export function addPagersFn<T>(
  find: (options: OptionsWithRql) => PagedResult<T> | Promise<PagedResult<T>>,
  options: OptionsWithRql,
  pagedResult: PagedResult<T>
): PagedResultWithPager<T> {
  return {
    ...pagedResult,
    previous: async () => {
      const result = await find({
        rql: rqlBuilder(options?.rql)
          .limit(
            pagedResult.page.limit,
            pagedResult.page.offset > 0
              ? pagedResult.page.offset - pagedResult.page.limit
              : 0
          )
          .build(),
      });
      return addPagersFn<T>(find, options, result);
    },
    next: async () => {
      const result = await find({
        rql: rqlBuilder(options?.rql)
          .limit(
            pagedResult.page.limit,
            pagedResult.page.offset + pagedResult.page.limit <
              pagedResult.page.total
              ? pagedResult.page.offset + pagedResult.page.limit
              : pagedResult.page.total
          )
          .build(),
      });
      return addPagersFn<T>(find, options, result);
    },
  };
}
