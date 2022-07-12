import nock from 'nock';
import { validateConfig } from '../../../src/utils';
import { USER_BASE } from '../../../src/constants';
import { createHttpClient } from '../../../src/http/client';
import { createProxyHttpClient } from '../../../src/http';
import { ConfigOauth2 } from '../../../src/types';
import {
  OauthTokenError,
  UserNotAuthenticatedError,
} from '../../../src/errors';

const mockParams = {
  host: 'https://apx.test.com',
};

describe('proxy client', () => {
  const config = validateConfig(mockParams) as ConfigOauth2;
  const http = createHttpClient({
    ...config,
    packageVersion: '',
  });

  let httpWithAuth: ReturnType<typeof createProxyHttpClient>;

  beforeEach(() => {
    nock.cleanAll();
    httpWithAuth = createProxyHttpClient(http, {
      ...config,
      requestLogger: value => value,
      responseLogger: value => value,
    });
  });

  it('should authorize', async () => {
    nock(mockParams.host).get(`${USER_BASE}/me`).reply(200, { id: 'mockId' });

    const { data: me } = await httpWithAuth.get(`${USER_BASE}/me`);

    expect(me.id).toBe('mockId');
  });

  it('should get userId', async () => {
    nock(mockParams.host).get(`${USER_BASE}/me`).reply(200, { id: 'mockId' });

    const userId = await httpWithAuth.userId;

    expect(userId).toBe('mockId');
  });

  it('should log out', async () => {
    nock(mockParams.host).post(`/logout`).reply(200);
    await expect(httpWithAuth.logout()).resolves.toBe(true);
  });

  it("shouldn't log out if function throws", async () => {
    nock(mockParams.host).post(`/logout`).reply(401);
    await expect(httpWithAuth.logout()).resolves.toBe(false);
  });

  it('should get userId but return undefined because server error', async () => {
    nock(mockParams.host).get(`${USER_BASE}/me`).reply(500);

    const userId = await httpWithAuth.userId;

    expect(userId).toBe(undefined);
  });

  it('throws on calls with missing jwt', async () => {
    nock(mockParams.host).get(`${USER_BASE}/me`).reply(401, { code: 104 });

    try {
      await httpWithAuth.get(`${USER_BASE}/me`);
    } catch (error) {
      expect(error).toBeInstanceOf(UserNotAuthenticatedError);
    }
  });

  it('throws on calls with expired token', async () => {
    nock(mockParams.host).get(`${USER_BASE}/me`).reply(401, { code: 108 });

    try {
      await httpWithAuth.get(`${USER_BASE}/me`);
    } catch (error) {
      expect(error).toBeInstanceOf(OauthTokenError);
    }
  });
});
