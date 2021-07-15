import { PagedResultBase } from '../../src/services/types';

export function createPagedResponse<T>(dataObject: T): PagedResultBase<T> {
  return {
    page: {
      total: 1,
      offset: 0,
      limit: 20,
    },
    data: [dataObject],
  };
}
