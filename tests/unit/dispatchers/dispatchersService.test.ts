import nock from 'nock';
import { AUTH_BASE, DISPATCHERS_BASE } from '../../../src/constants';
import { Client, client, ParamsOauth2, rqlBuilder } from '../../../src/index';
import {
  // dispatcherData,
  dispatchersResponse,
} from '../../__helpers__/dispatcher';

describe('Dispatchers Service', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';
  // const dispatcherId = dispatcherData.id;

  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = client({
      apiHost,
      clientId: '',
    });

    const mockToken = 'mockToken';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    await sdk.auth.authenticate({
      username: '',
      password: '',
    });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should find a list of dispatchers', async () => {
    const rql = rqlBuilder().build();
    nock(`${apiHost}${DISPATCHERS_BASE}`)
      .get('/')
      .reply(200, dispatchersResponse);

    const res = await sdk.tasks.find({ rql });

    expect(res.data.length).toBeGreaterThan(0);
  });
});
