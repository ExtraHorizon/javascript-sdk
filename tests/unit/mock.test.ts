import { getMockSdk } from '../../src/mock';

describe('mock SDK', () => {
  it('should build a valid mock SDK', async () => {
    const sdk = getMockSdk(jest.fn);
    expect(sdk.data).toBeDefined();
  });
});
