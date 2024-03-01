import nock from 'nock';
import { USER_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  ParamsOauth2,
  rqlBuilder,
} from '../../../src/index';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Forgot Password Requests Service', () => {
  const host = 'https://api.xxx.extrahorizon.com';
  const exampleForgotPasswordRequestResponse = {
    id: '649be612a20eef8147f25f81',
    user_id: '64a4278da7b5c90d6975cab2',
    mode: 'pin_code',
    request_count: 1,
    last_request_timestamp: 1565954044301,
    failed_attempts: 1,
    last_failed_attempt_timestamp: 1588890782006,
    expiry_timestamp: 1590866883911,
    update_timestamp: 1588890782007,
    creation_timestamp: 1510681308855,
  };
  const exampleForgotPasswordRequest = {
    id: '649be612a20eef8147f25f81',
    userId: '64a4278da7b5c90d6975cab2',
    mode: 'pin_code',
    requestCount: 1,
    lastRequestTimestamp: new Date(1565954044301),
    failedAttempts: 1,
    lastFailedAttemptTimestamp: new Date(1588890782006),
    expiryTimestamp: new Date(1590866883911),
    updateTimestamp: new Date(1588890782007),
    creationTimestamp: new Date(1510681308855),
  };

  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = createClient({
      host,
      clientId: '',
      accessToken: '',
    });
  });

  it('Returns forgot password requests', async () => {
    nock(`${host}${USER_BASE}`)
      .get('/forgot_password_requests/?eq(user_id,64a4278da7b5c90d6975cab2)')
      .reply(200, createPagedResponse(exampleForgotPasswordRequestResponse));

    const result = await sdk.users.forgotPasswordRequests.find({
      rql: rqlBuilder().eq('user_id', '64a4278da7b5c90d6975cab2').build(),
    });

    expect(result).toStrictEqual(createPagedResponse(exampleForgotPasswordRequest));
  });

  it('Returns a single password reset request', async () => {
    nock(`${host}${USER_BASE}`)
      .get('/forgot_password_requests/?eq(user_id,64a4278da7b5c90d6975cab2)')
      .reply(200, createPagedResponse(exampleForgotPasswordRequestResponse));

    const result = await sdk.users.forgotPasswordRequests.findByUserId('64a4278da7b5c90d6975cab2');

    expect(result).toStrictEqual(exampleForgotPasswordRequest);
  });

  it('Returns a password reset request by its id', async () => {
    nock(`${host}${USER_BASE}`)
      .get('/forgot_password_requests/?eq(id,649be612a20eef8147f25f81)')
      .reply(200, createPagedResponse(exampleForgotPasswordRequestResponse));

    const result = await sdk.users.forgotPasswordRequests.findById('649be612a20eef8147f25f81');

    expect(result).toStrictEqual(exampleForgotPasswordRequest);
  });

  it('Returns a password reset request by a user id', async () => {
    nock(`${host}${USER_BASE}`)
      .get('/forgot_password_requests/?eq(user_id,64a4278da7b5c90d6975cab2)')
      .reply(200, createPagedResponse(exampleForgotPasswordRequestResponse));

    const result = await sdk.users.forgotPasswordRequests.findByUserId('64a4278da7b5c90d6975cab2');

    expect(result).toStrictEqual(exampleForgotPasswordRequest);
  });

  it('Removes a forgot password request', async () => {
    const id = '649be612a20eef8147f25f81';

    nock(`${host}${USER_BASE}`)
      .delete(`/forgot_password_requests/${id}`)
      .reply(200, { records_affected: 1 });

    const result = await sdk.users.forgotPasswordRequests.remove(id);

    expect(result).toStrictEqual({ affectedRecords: 1 });
  });
});
