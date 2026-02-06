import { getMockSdk } from '../../src';

describe('mock SDK', () => {
  it('Builds a valid mock SDK', async () => {
    const sdk = getMockSdk(jest.fn);
    expect(sdk.data).toBeDefined();
  });
});
