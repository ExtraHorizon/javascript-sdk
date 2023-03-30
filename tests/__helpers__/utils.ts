import { randomBytes } from 'crypto';
import { PagedResult } from '../../src/services/types';

export function createPagedResponse<T>(
  dataObject: T,
  overrides?: any
): PagedResult<T> {
  const isArray = Array.isArray(dataObject);
  return {
    page: {
      total: 1,
      offset: 0,
      limit: 20,
      ...overrides,
    },
    data: isArray ? dataObject : [dataObject],
  };
}

export function randomHexString(numberOfBytes = 20) {
  return randomBytes(numberOfBytes).toString('hex');
}
