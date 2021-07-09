import { rqlBuilder, RQLString } from '../rql';
import { AddPagers, PagedResult, PagedResultWithPager } from './types';

export const addPagers: AddPagers = function addPagersFn<S, T>(
  // this: S,
  rql: RQLString,
  // limit: number,
  // offset: number,
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

// interface AddPagers {
//   // <T>(this: T): T;
//   call<S, T>(this: S, ...argArray: any[]): PagedResultWithPager<T>;
// }

// interface AddPagersFn {
//   (): AddPagers;
//   // eslint-disable-next-line @typescript-eslint/ban-types
//   call(this: Function, ...argArray: any[]): AddPagers;
// }
// interface AddPagers {
//   <T>(
//     rql: RQLString,
//     limit: number,
//     offset: number,
//     pagedResult: PagedResult<T>
//   ): PagedResultWithPager<T>;
// }

// export const addPagersFn: AddPagersFn = function (): AddPagers {
//   function addPagers<T>(
//     rql: RQLString,
//     limit: number,
//     offset: number,
//     pagedResult: PagedResult<T>
//   ): PagedResultWithPager<T> {
//     return {
//       ...pagedResult,
//       previousPage: async () => {
//         const result = await this.find({
//           rql: rqlBuilder(rql.substr(1) as any)
//             .limit(limit, offset + limit)
//             .build(),
//         });
//         return addPagers.call(this, rql, limit, offset - limit, result);
//       },
//       nextPage: async () => {
//         const result = await this.find({
//           rql: rqlBuilder(rql.substr(1) as any)
//             .limit(limit, offset + limit)
//             .build(),
//         });
//         return addPagers.call(this, rql, limit, offset + limit, result);
//       },
//     };
//   }
//   return addPagers;
// };
