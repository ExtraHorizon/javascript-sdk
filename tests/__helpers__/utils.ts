import { randomBytes } from 'crypto';
import { PagedResult } from '../../src/services/types';

export function createPagedResponse<T>(
  dataObject: T,
  overrides?: any
): PagedResult<T> {
  const data = Array.isArray(dataObject) ? dataObject : [dataObject];
  return {
    page: {
      total: data.length,
      offset: 0,
      limit: 20,
      ...overrides,
    },
    data,
  };
}

export function randomHexString(numberOfBytes = 20) {
  return randomBytes(numberOfBytes).toString('hex');
}
