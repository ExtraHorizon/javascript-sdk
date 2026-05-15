import { OptionsWithRql, rqlBuilder } from '../../src';
import { findAllGeneric } from '../../src/services/helpers';

describe('Helpers', () => {
  describe('findAllGeneric', () => {
    let findMock: jest.Mock;

    const firstPage = {
      data: [1, 2, 3],
      page: {
        total: 5,
        limit: 3,
        offset: 0,
      },
    };

    const secondPage = {
      data: [4, 5],
      page: {
        total: 5,
        limit: 3,
        offset: 3,
      },
    };

    beforeEach(() => {
      findMock = jest.fn()
        .mockResolvedValueOnce(firstPage)
        .mockResolvedValueOnce(secondPage);
    });

    it('Iterates through multiple pages and returns all results', async () => {
      const results = await findAllGeneric(findMock, undefined);
      expect(results).toStrictEqual([1, 2, 3, 4, 5]);
      expect(findMock).toHaveBeenCalledTimes(2);
      expect(findMock).toHaveBeenNthCalledWith(1, { rql: '?limit(50)' });
      expect(findMock).toHaveBeenNthCalledWith(2, { rql: '?limit(3,3)' });
    });

    it('Applies all options supplied to all calls to `find`', async () => {
      const options: OptionsWithRql = {
        rql: rqlBuilder().eq('field', 'value').build(),
        headers: { 'X-Custom-Header': 'CustomValue' },
        shouldRetry: true,
      };

      await findAllGeneric(findMock, options);

      expect(findMock).toHaveBeenNthCalledWith(1, {
        rql: '?eq(field,value)&limit(50)',
        headers: { 'X-Custom-Header': 'CustomValue' },
        shouldRetry: true,
      });

      expect(findMock).toHaveBeenNthCalledWith(2, {
        rql: '?eq(field,value)&limit(3,3)',
        headers: { 'X-Custom-Header': 'CustomValue' },
        shouldRetry: true,
      });
    });
  });
});
