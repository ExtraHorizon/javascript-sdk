import nock from 'nock';
import {USER_BASE} from '../../../src/constants';
import {createOAuth2Client, OAuth2Client,} from '../../../src/index';

describe('Settings Service', () => {
  const host = 'https://api.xxx.extrahorizon.com';
  const exampleSettings = {
    limitHashActivationRequests: false,
    limitHashForgotPasswordRequests: false,
    enablePinCodeActivationRequests: false,
    enablePinCodeForgotPasswordRequests: false,
  };
  const exampleResponse = {
    limit_hash_activation_requests: false,
    limit_hash_forgot_password_requests: false,
    enable_pin_code_activation_requests: false,
    enable_pin_code_forgot_password_requests: false,
  };

  let sdk: OAuth2Client;

  beforeAll(async () => {
    sdk = createOAuth2Client({
      host,
      clientId: '',
      accessToken: '',
    });
  });

  it('Returns the verification settings', async () => {
    nock(`${host}${USER_BASE}`)
      .get('/settings/verification')
      .reply(200, exampleResponse);

    const result = await sdk.users.settings.getVerificationSettings();

    expect(result).toStrictEqual(exampleSettings);
  });

  it('Updates the verification settings', async () => {
    const updateData = { limitHashActivationRequests: true };
    const requestData = { limit_hash_activation_requests: true };
    const responseData = { ...exampleResponse, ...requestData };
    const updatedSettings = { ...exampleSettings, ...updateData };

    nock(`${host}${USER_BASE}`)
      .put('/settings/verification', requestData)
      .reply(200, responseData);

    const result = await sdk.users.settings.updateVerificationSettings(updateData);

    expect(result).toStrictEqual(updatedSettings);
  });
});
