// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import { AUTH_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';
import { mfaSetting } from '../../__helpers__/auth';

describe('Auth - Applications', () => {
  const host = 'https://api.xxx.fibricheck.com';

  const userId = '60701bf059080100071a3d90';

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
  });

  it('should get mfa settings for user', async () => {
    nock(`${host}${AUTH_BASE}`)
      .get(`/mfa/users/${userId}`)
      .reply(200, mfaSetting);

    const mfaSettingResult = await sdk.auth.users.getMfaSetting(userId);

    expect(mfaSettingResult.id).toEqual(mfaSetting.id);
  });

  it('should enable mfa for user', async () => {
    nock(`${host}${AUTH_BASE}`)
      .post(`/mfa/users/${userId}/enable`)
      .reply(200, { affectedRecords: 1 });

    const enableResult = await sdk.auth.users.enableMfa(userId, {
      presenceToken: 'test',
    });

    expect(enableResult.affectedRecords).toEqual(1);
  });

  it('should disable mfa for user', async () => {
    nock(`${host}${AUTH_BASE}`)
      .post(`/mfa/users/${userId}/disable`)
      .reply(200, { affectedRecords: 1 });

    const enableResult = await sdk.auth.users.disableMfa(userId, {
      presenceToken: 'test',
    });

    expect(enableResult.affectedRecords).toEqual(1);
  });

  it('should add mfa method for user', async () => {
    nock(`${host}${AUTH_BASE}`)
      .post(`/mfa/users/${userId}/methods`)
      .reply(200, mfaSetting.methods[0]);

    const addedMethod = await sdk.auth.users.addMfaMethod(userId, {
      presenceToken: 'test',
      type: 'totp',
      name: ' totp',
      tags: [],
    });

    expect(addedMethod.id).toEqual('609b8ad0c0de01f7b1e8b54d');
  });

  it('should verify mfa method for user', async () => {
    nock(`${host}${AUTH_BASE}`)
      .post(
        `/mfa/users/${userId}/methods/${mfaSetting.methods[0].id}/verification/confirm`
      )
      .reply(200, { description: 'description' });

    const addedMethod = await sdk.auth.users.confirmMfaMethodVerification(
      userId,
      mfaSetting.methods[0].id,
      { presenceToken: 'presenceToken', code: '123456' }
    );

    expect(addedMethod.description).toEqual('description');
  });

  it('should remove mfa method for user', async () => {
    nock(`${host}${AUTH_BASE}`)
      .post(`/mfa/users/${userId}/methods/${mfaSetting.methods[0].id}/remove`)
      .reply(200, { affectedRecords: 1 });

    const removedMfaMethod = await sdk.auth.users.removeMfaMethod(
      userId,
      mfaSetting.methods[0].id,
      { presenceToken: 'presenceToken' }
    );

    expect(removedMfaMethod.affectedRecords).toEqual(1);
  });
});
