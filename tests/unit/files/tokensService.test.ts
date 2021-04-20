import * as nock from 'nock';
import { AUTH_BASE, FILES_BASE } from '../../../src/constants';
import { Client, client } from '../../../src/index';
import { TokenPermission } from '../../../src/services/files/types';

jest.mock('fs');

describe('Token Service', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';
  const token = '5a0b2adc265ced65a8cab861';

  let sdk: Client;

  beforeAll(async () => {
    sdk = client({
      apiHost,
    });

    const mockToken = 'mockToken';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });

    await sdk.authenticate({
      clientId: '',
      username: '',
      password: '',
    });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Delete a token', async () => {
    const tokenToAccess = '5a0b2adc265ced65a8cab862';
    nock(`${apiHost}${FILES_BASE}`)
      .delete(`/${token}/tokens/${tokenToAccess}`)
      .reply(200);

    const res = await sdk.files.deleteToken(token, tokenToAccess);

    expect(res).toBeUndefined();
  });

  it('Generate a token for a file', async () => {
    const tokenData = {
      accessLevel: TokenPermission.FULL,
    };
    nock(`${apiHost}${FILES_BASE}`)
      .post(`/${token}/tokens`)
      .reply(200, {
        ...tokenData,
        token,
      });

    const res = await sdk.files.generateToken(token, tokenData);

    expect(res.token).toBe(token);
    expect(res.accessLevel).toBe(TokenPermission.FULL);
  });
});
