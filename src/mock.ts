import { recursiveMap } from './http/utils';
import { Client, createClient } from './client';
import { ClientParams } from './types';

const { raw: _raw, ...sdk } = createClient({ host: '' } as any);

/**
 * Returns a mocked version of the SDK. Requires a mocking function like `jest.fn`
 * @param fn
 * @returns {Client<ClientParams>} mockSdk
 * @example
 * describe("mock SDK", () => {
 *   const sdk = getMockSdk(jest.fn);
 *   it("should be valid mock", async () => {
 *     expect(sdk.data).toBeDefined();
 *   });
 * });
 */
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
