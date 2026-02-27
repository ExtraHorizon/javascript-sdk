import { getUrlInfoFromRequest } from '../../../src/http/oAuth1Signature';

describe('http/oAuth1Signature', () => {
  describe('getUrlInfoFromRequest', () => {
    // This test covers a regression where the `qs` package changed it's default behavior to decode dots in the keys of the query string
    it('Does not attempt to decode encoded dots in the keys of the query string', () => {
      // Queries like this are common with the double encoding of RQL query values
      const result = getUrlInfoFromRequest('https://my.exh.io/users/v1/?eq(name,value%252Ewith%252Edots)');

      expect(result).toStrictEqual({
        baseUrl: 'https://my.exh.io/users/v1/',
        searchParameters: {
          // The native JS URL parser will decode the query string once, that's what we're expecting to resolve to here.
          // The broken version would decode the query string twice, which would result in `eq(name,value.with.dots)`
          'eq(name,value%2Ewith%2Edots)': '',
        },
      });
    });
  });
});
