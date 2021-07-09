import { rqlBuilder, RQLString } from '../rql';
import { AddPagers, PagedResult, PagedResultWithPager } from './types';

export const addPagers: AddPagers = function addPagersFn<S, T>(
  rql: RQLString,
  pagedResult: PagedResult<T>
): PagedResultWithPager<T> {
  return {
    ...pagedResult,
    previousPage: async () => {
      const result = await this.find({
        rql: rqlBuilder(rql)
          .limit(
            pagedResult.page.limit,
            pagedResult.page.offset > 0
              ? pagedResult.page.offset - pagedResult.page.limit
              : 0
          )
          .build(),
      });
      return addPagers.call<S, T>(this, rql, result);
    },
    nextPage: async () => {
      const result = await this.find({
        rql: rqlBuilder(rql)
          .limit(
            pagedResult.page.limit,
            pagedResult.page.offset + pagedResult.page.limit <
              pagedResult.page.total
              ? pagedResult.page.offset + pagedResult.page.limit
              : pagedResult.page.offset
          )
          .build(),
      });
      return addPagers.call<S, T>(this, rql, result);
    },
  };
};
