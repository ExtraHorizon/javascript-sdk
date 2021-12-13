import { recursiveMap } from './http/utils';
import {
  createProxyClient,
  createOAuth1Client,
  createOAuth2Client,
} from './client';
import type {
  MockClientOAuth1,
  MockClientOAuth2,
  MockClientProxy,
} from './mockType';

const RAW_VERBS = [
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'request',
  'all',
  'head',
  'options',
];

/**
 * Returns a mocked version of the Proxy SDK. Requires a mocking function like `jest.fn`
 * @param fn  mocking function
 * @returns {MockClientProxy} mockSdk
 * @example
 * import { getMockSdkProxy } from "@extrahorizon/javascript-sdk";
 * describe("mock SDK", () => {
 *   const sdk = getMockSdkProxy(jest.fn);
 *   it("should be valid mock", async () => {
 *     expect(sdk.data).toBeDefined();
 *   });
 * });
 */
export const getMockSdkProxy = <MockFn>(
  fn: () => MockFn
): MockClientProxy<MockFn> => ({
  ...recursiveMap(value => (typeof value === 'function' ? fn() : value))(
    createProxyClient({ host: '' })
  ),
  raw: RAW_VERBS.reduce(
    (memo, verb) => ({
      ...memo,
      [verb]: fn(),
    }),
    {}
  ),
});

/**
 * Returns a mocked version of the OAuth2 SDK. Requires a mocking function like `jest.fn`
 * @param fn  mocking function
 * @returns {MockClientOAuth2} mockSdk
 * @example
 * import { getMockSdkOAuth2 } from "@extrahorizon/javascript-sdk";
 * describe("mock SDK", () => {
 *   const sdk = getMockSdkOAuth2(jest.fn);
 *   it("should be valid mock", async () => {
 *     expect(sdk.data).toBeDefined();
 *   });
 * });
 */
export const getMockSdkOAuth2 = <MockFn>(
  fn: () => MockFn
): MockClientOAuth2<MockFn> => ({
  ...recursiveMap(value => (typeof value === 'function' ? fn() : value))(
    createOAuth2Client({ host: '', clientId: '' })
  ),
  raw: RAW_VERBS.reduce(
    (memo, verb) => ({
      ...memo,
      [verb]: fn(),
    }),
    {}
  ),
});

/**
 * Returns a mocked version of the OAuth1 SDK. Requires a mocking function like `jest.fn`
 * @param fn  mocking function
 * @returns {MockClientOAuth1} mockSdk
 * @example
 * import { getMockSdkOAuth1 } from "@extrahorizon/javascript-sdk";
 * describe("mock SDK", () => {
 *   const sdk = getMockSdkOAuth1(jest.fn);
 *   it("should be valid mock", async () => {
 *     expect(sdk.data).toBeDefined();
 *   });
 * });
 */
export const getMockSdkOAuth1 = <MockFn>(
  fn: () => MockFn
): MockClientOAuth1<MockFn> => ({
  ...recursiveMap(value => (typeof value === 'function' ? fn() : value))(
    createOAuth1Client({
      host: '',
      consumerKey: '',
      consumerSecret: '',
    })
  ),
  raw: RAW_VERBS.reduce(
    (memo, verb) => ({
      ...memo,
      [verb]: fn(),
    }),
    {}
  ),
});
