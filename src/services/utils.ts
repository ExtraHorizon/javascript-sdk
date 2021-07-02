import { rqlBuilder, RQLString } from '../rql';
import { PagedResult } from './types';

export type PagedResultWithPager<T> = PagedResult<T> & {
  previousPage: () => Promise<PagedResultWithPager<T>>;
  nextPage: () => Promise<PagedResultWithPager<T>>;
};

interface AddPagers {
  call<S, T>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    thisArg: S,
    ...argArray: any[]
  ): PagedResultWithPager<T>;
}

export const addPagers: AddPagers = function addPagersFn<S, T>(
  // this: S,
  rql: RQLString,
  limit: number,
  offset: number,
  pagedResult: PagedResult<T>
): PagedResultWithPager<T> {
  return {
    ...pagedResult,
    previousPage: async () => {
      const result = await this.find({
        rql: rqlBuilder(rql)
          .limit(limit, offset + limit)
          .build(),
      });
      return addPagers.call<S, T>(this, rql, limit, offset - limit, result);
    },
    nextPage: async () => {
      const result = await this.find({
        rql: rqlBuilder(rql)
          .limit(limit, offset + limit)
          .build(),
      });
      return addPagers.call<S, T>(this, rql, limit, offset + limit, result);
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
