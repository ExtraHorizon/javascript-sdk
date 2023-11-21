import { HttpInstance } from '../http/types';
import { camelize, decamelize } from '../http/utils';
import {
  OptionsBase,
  OptionsWithRql,
  PagedResult,
  PagedResultWithPager,
} from './types';
import { rqlBuilder } from '../rql';

const MAX_LIMIT = 50;

export type FindAllIterator<T> = AsyncGenerator<
  PagedResult<T>,
  Record<string, never>,
  void
>;

export async function* findAllIterator<T>(
  find: (options: OptionsWithRql) => PagedResult<T> | Promise<PagedResult<T>>,
  options: OptionsWithRql
): FindAllIterator<T> {
  async function* makeRequest(requestOptions: OptionsWithRql) {
    const result = await find(requestOptions);
    yield result;

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
    ...options,
    rql:
      options?.rql && options.rql.includes('limit(')
        ? options.rql
        : rqlBuilder(options?.rql).limit(MAX_LIMIT).build(),
  });

  return {};
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
  let result = pagedResult;

  async function previous() {
    result = await find({
      rql: rqlBuilder(options?.rql)
        .limit(
          result.page.limit,
          result.page.offset > 0 ? result.page.offset - result.page.limit : 0
        )
        .build(),
    });
    return addPagersFn<T>(find, options, result);
  }

  async function next() {
    result = await find({
      rql: rqlBuilder(options?.rql)
        .limit(
          result.page.limit,
          result.page.offset + result.page.limit < result.page.total
            ? result.page.offset + result.page.limit
            : result.page.offset + result.page.limit
        )
        .build(),
    });
    return addPagersFn<T>(find, options, result);
  }
  return {
    ...result,
    previous,
    next,
  };
}

export function addCustomPropertiesToConfig(
  customProperties: string[],
  httpInstance: HttpInstance,
  requestOptions: OptionsBase
) {
  const camilizedCustomProperties = customProperties.map(camelize);
  const snakifiedCustomProperties = customProperties.map(decamelize);

  // First check local settings
  // If locally turned off, don't skip on any properties
  if (requestOptions.skipCaseNormalizationForCustomProperties === false) {
    return requestOptions;
  }

  // If locally turned on, skip on the custom properties
  if (requestOptions.skipCaseNormalizationForCustomProperties === true) {
    return {
      ...requestOptions,
      skipKeyNormalizationForProperties: [
        ...camilizedCustomProperties,
        ...snakifiedCustomProperties,
      ],
    };
  }

  // If locally it is not set
  // If globally turned off, don't skip on any properties
  if (httpInstance.skipCaseNormalizationForCustomProperties === false) {
    return requestOptions;
  }

  // If globally turned on, skip on the custom properties
  return {
    ...requestOptions,
    skipKeyNormalizationForProperties: [
      ...camilizedCustomProperties,
      ...snakifiedCustomProperties,
    ],
  };
}
