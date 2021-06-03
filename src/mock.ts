import { recursiveMap } from './http/utils';
import { Client, createClient } from './client';
import { ClientParams } from './types';

const { raw: _raw, ...sdk } = createClient({ host: '' } as any);

export const getMockSdk = (fn): Client<ClientParams> => ({
  ...recursiveMap(value => (typeof value === 'function' ? fn : value))(sdk),
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
      [verb]: fn,
    }),
    {}
  ),
});
