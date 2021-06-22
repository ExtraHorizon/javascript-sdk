import nock from 'nock';
import { AUTH_BASE, DISPATCHERS_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  ParamsOauth2,
  rqlBuilder,
} from '../../../src/index';
import {
  dispatcherData,
  dispatchersResponse,
} from '../../__helpers__/dispatcher';

describe('Dispatchers Service', () => {
  const host = 'https://api.xxx.fibricheck.com';
  const dispatcherId = dispatcherData.id;

  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = createClient({
      host,
      clientId: '',
    });

    const mockToken = 'mockToken';
    nock(host)
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
    nock(`${host}${DISPATCHERS_BASE}`).get('/').reply(200, dispatchersResponse);

    const res = await sdk.dispatchers.find({ rql });

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should find a dispatcher by id', async () => {
    nock(`${host}${DISPATCHERS_BASE}`)
      .get(`/?eq(id,${dispatcherId})`)
      .reply(200, dispatchersResponse);

    const dispatcher = await sdk.dispatchers.findById(dispatcherId);

    expect(dispatcher.id).toBe(dispatcherId);
  });

  it('should find the first dispatcher', async () => {
    nock(`${host}${DISPATCHERS_BASE}`).get('/').reply(200, dispatchersResponse);

    const dispatcher = await sdk.dispatchers.findFirst();

    expect(dispatcher.id).toBe(dispatcherId);
  });

  it('should create a dispatcher', async () => {
    nock(`${host}${DISPATCHERS_BASE}`).post('/').reply(200, dispatcherData);

    const res = await sdk.dispatchers.create(dispatcherData);

    expect(res.id).toBe(dispatcherData.id);
  });

  it('should delete a dispatcher', async () => {
    nock(`${host}${DISPATCHERS_BASE}`).delete(`/${dispatcherId}`).reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.dispatchers.remove(dispatcherId);

    expect(res.affectedRecords).toBe(1);
  });
});
