import { recursiveMap } from './http/utils';
import { createClient } from './index';

const { raw: _raw, ...sdk } = createClient({ host: '' } as any);

export const mockSdk = {
  ...recursiveMap(value => (typeof value === 'function' ? jest.fn() : value))(
    sdk
  ),
  raw: [
    'get',
    'post',
    'put',
    'patch',
    'delete',
    'request',
    'all',
    'head',
    'options',
  ].reduce(
    (memo, verb) => ({
      ...memo,
      [verb]: jest.fn(),
    }),
    {}
  ),
};

function client() {
  return mockSdk;
}

export default client;
