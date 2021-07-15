import { rqlBuilder, RQLString } from '../rql';
import { AddPagers, PagedResult, PagedResultBase } from './types';

export const addPagers: AddPagers = function addPagersFn<S, T>(
  requiredParams: any[],
  options: { rql: RQLString },
  pagedResult: PagedResultBase<T>
): PagedResult<T> {
  return {
    ...pagedResult,
    previousPage: async () => {
      const result = await this.find(...requiredParams, {
        rql: rqlBuilder(options?.rql)
          .limit(
            pagedResult.page.limit,
            pagedResult.page.offset > 0
              ? pagedResult.page.offset - pagedResult.page.limit
              : 0
          )
          .build(),
      });
      return addPagers.call<S, T>(this, requiredParams, options, result);
    },
    nextPage: async () => {
      const result = await this.find(...requiredParams, {
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
      return addPagers.call<S, T>(this, requiredParams, options, result);
    },
  };
};
