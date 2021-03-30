import * as nock from 'nock';
import { client } from '../../src/index';
import { apiHost } from '../__helpers__/config';
import { userData, updatedUserData, newUserData, ResourceUnknownException } from '../__helpers__/user';
import { userResponse } from '../__helpers__/apiResponse';

describe('Users', () => {
  const userId = '5a0b2adc265ced65a8cab865';
  const groupId = '5bfbfc3146e0fb321rsa4b28';
  const oldEmail = 'test@test.test';
  const newEmail = 'testje@testje.testje';
  const oldPass = 'OldPass123';
  const newPass = 'NewPass123';
  const hash = 'bced43a8ccb74868536ae8bc5a13a40385265038';

  let sdk;

  beforeAll(() => {
    sdk = client({
      apiHost: process.env.API_HOST,
      oauth: {
        clientId: process.env.CLIENT_ID,
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
      },
    });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Can get health', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get('/health')
      .reply(200, '');

    const health = await sdk.users.getHealth();

    expect(health).toBe(true);
  });

  it('Can get current', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get('/me')
      .reply(200, userData);

    const user = await sdk.users.getCurrent();

    expect(user.id);
  });

  it('Can get users list', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get('/')
      .reply(200, userResponse);

    const users = await sdk.users.getList();

    expect(users.data.length).toBeGreaterThan(0);
  });

  it('Can get patients list', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get('/patients')
      .reply(200, userResponse);

    const users = await sdk.users.getPatients();

    expect(users.data.length).toBeGreaterThan(0);
  });

  it('Can get staff list', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get('/staff')
      .reply(200, userResponse);

    const users = await sdk.users.getStaff();

    expect(users.data.length).toBeGreaterThan(0);
  });

  it('Can get user by id', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get(`/${userId}`)
      .reply(200, userData);

    const user = await sdk.users.getById(userId);

    expect(user.id);
  });

  it('Can not get user by id', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get(`/${userId}`)
      .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await sdk.users.getById(userId);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe('RESOURCE_UNKNOWN_EXCEPTION');
  });

  it('Can update a user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .put(`/${userId}`)
      .reply(200, updatedUserData);

    const user = await sdk.users.update(userId, { first_name: 'testje', last_name: 'testje' });

    expect(user.firstName).toBe('testje');
    expect(user.lastName).toBe('testje');
  });

  it('Can not update a user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .put(`/${userId}`)
      .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await sdk.users.update(userId, { first_name: 'testje', last_name: 'testje' });
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe('RESOURCE_UNKNOWN_EXCEPTION');
  });

  it('Can remove a user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .delete(`/${userId}`)
      .reply(200, { recordsAffected: 1 });

    const result = await sdk.users.remove(userId);

    expect(result).toBeGreaterThan(0);
  });

  it('Can not remove a user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .delete(`/${userId}`)
      .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await sdk.users.remove(userId);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe('RESOURCE_UNKNOWN_EXCEPTION');
  });

  it('Can update a users email', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .put(`/${userId}/email`)
      .reply(200, updatedUserData);

    const user = await sdk.users.updateEmail(userId, newEmail);

    expect(user.email).toBe(newEmail);
  });

  it('Add a patient enlistment to a user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post(`/${userId}/patient_enlistments`)
      .reply(200, { recordsAffected: 1 });

    const result = await sdk.users.addPatientEnlistment(userId, groupId);

    expect(result).toBeGreaterThan(0);
  });

  it('Can remove a patient enlistment from a user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .delete(`/${userId}/patient_enlistments/${groupId}`)
      .reply(200, { recordsAffected: 1 });

    const result = await sdk.users.deletePatientEnlistment(userId, groupId);

    expect(result).toBeGreaterThan(0);
  });

  it('Can not remove a patient enlistment from a user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .delete(`/${userId}/patient_enlistments/${groupId}`)
      .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await sdk.users.deletePatientEnlistment(userId, groupId);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe('RESOURCE_UNKNOWN_EXCEPTION');
  });

  it('Can register a new user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/register')
      .reply(200, newUserData);

    const newUser = await sdk.users.register(newUserData);

    expect(newUser.id);
  });

  it('Can update a users password', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .put('/password')
      .reply(200, userData);

    const result = await sdk.users.updatePassword(oldPass, newPass);

    expect(result).toBe(true);
  });

  it('Can authenticate', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/authenticate')
      .reply(200, userData);

    const authenticatedUser = await sdk.users.authenticate(oldEmail, newPass);

    expect(authenticatedUser.id);
  });

  it('Can request activation mail', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get(`/activation?email=${newEmail}`)
      .reply(200);

    const result = await sdk.users.requestActivationMail(newEmail);

    expect(result).toBe(true);
  });

  it('Can complete an email activation', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/activation')
      .reply(200);

    const result = await sdk.users.completeActivationMail(hash);

    expect(result).toBe(true);
  });

  it('Can request a password reset', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get(`/forgot_password?email=${newEmail}`)
      .reply(200);

    const result = await sdk.users.requestPasswordReset(newEmail);

    expect(result).toBe(true);
  });

  it('Can complete a password reset', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/forgot_password')
      .reply(200);

    const result = await sdk.users.completePasswordReset(hash, newPass);

    expect(result).toBe(true);
  });

  it('Confirm the password for the user making the request', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/confirm_password')
      .reply(200);

    const result = await sdk.users.confirmPassword(newPass);

    expect(result).toBe(true);
  });

  it('Can check if email is available', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get(`/email_available?email=${newEmail}`)
      .reply(200);

    const result = await sdk.users.emailAvailable(newEmail);

    expect(result).toBe(true);
  });
});
