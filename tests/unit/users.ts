import * as nock from 'nock';
import { ResourceUnknownError } from '../../src/errors';
import { client } from '../../src/index';
import {
  userData,
  updatedUserData,
  ResourceUnknownException,
} from '../__helpers__/user';

describe('Users', () => {
  const userId = '5a0b2adc265ced65a8cab865';
  const apiHost = 'https://api.xxx.fibricheck.com';
  let sdk;

  beforeAll(() => {
    sdk = client({
      apiHost,
      oauth: {
        clientId: '',
        username: '',
        password: '',
      },
    });

    const mockToken = 'mockToken';
    nock(apiHost)
      .post('/auth/v2/oauth2/token')
      .reply(200, { access_token: mockToken });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Can get health', async () => {
    nock(`${apiHost}/users/v1`).get('/health').reply(200, '');

    const health = await sdk.users.health();

    expect(health).toBe(true);
  });

  it('Can get me', async () => {
    const mockToken = 'mockToken';
    nock(apiHost)
      .post('/auth/v2/oauth2/token')
      .reply(200, { access_token: mockToken });
    nock(`${apiHost}/users/v1`).get('/me').reply(200, userData);

    const user = await sdk.users.me();

    expect(user.id);
  });

  it('Can get user by id', async () => {
    nock(`${apiHost}/users/v1`).get(`/${userId}`).reply(200, userData);

    const user = await sdk.users.findById(userId);

    expect(user.id);
  });

  it('Can not get user by id', async () => {
    expect.assertions(1);
    nock(`${apiHost}/users/v1`)
      .get(`/${userId}`)
      .reply(404, ResourceUnknownException);

    try {
      await sdk.users.findById(userId);
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceUnknownError);
    }
  });

  it('Can update a user', async () => {
    nock(`${apiHost}/users/v1`).put(`/${userId}`).reply(200, updatedUserData);

    const user = await sdk.users.update(userId, {
      firstName: 'testje',
      lastName: 'testje',
    });

    expect(user.firstName).toBe('testje');
    expect(user.lastName).toBe('testje');
  });

  it('Can not update a user', async () => {
    nock(`${apiHost}/users/v1`)
      .put(`/${userId}`)
      .reply(404, ResourceUnknownException);

    try {
      await sdk.users.update(userId);
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceUnknownError);
    }
  });
});
