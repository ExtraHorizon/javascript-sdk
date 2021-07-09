import { recursiveMap } from './http/utils';
import { createClient } from './client';
import type { MockClient } from './mockType';

const { raw: _raw, ...sdk } = createClient({ host: '' } as any);

/**
 * Returns a mocked version of the SDK. Requires a mocking function like `jest.fn`
 * @param fn  mocking function
 * @returns {MockClient} mockSdk
 * @example
 * import { getMockSdk } from "@extrahorizon/javascript-sdk";
 * describe("mock SDK", () => {
 *   const sdk = getMockSdk(jest.fn);
 *   it("should be valid mock", async () => {
 *     expect(sdk.data).toBeDefined();
 *   });
 * });
 */
export const getMockSdk = <MockFn>(fn: () => MockFn): MockClient<MockFn> => ({
  ...recursiveMap(value => (typeof value === 'function' ? fn() : value))(sdk),
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
      [verb]: fn(),
    }),
    {}
  ),
});
