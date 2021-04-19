import * as nock from 'nock';
import { AUTH_BASE, USER_BASE } from '../../../src/constants';
import { ResourceUnknownError } from '../../../src/errors';
import { Client, client } from '../../../src/index';
import {
  userData,
  newUserData,
  updatedUserData,
  resourceUnknownError,
} from '../../__helpers__/user';
import {
  patientsResponse,
  staffResponse,
  userResponse,
} from '../../__helpers__/apiResponse';

describe('Users Service', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';
  const userId = '5a0b2adc265ced65a8cab865';
  const groupId = '5bfbfc3146e0fb321rsa4b28';
  // const oldEmail = 'old@bbb.ccc';
  const newEmail = 'new@bbb.ccc';
  const oldPassword = 'OldPass123';
  const newPassword = 'NewPass123';
  const hash = 'bced43a8ccb74868536ae8bc5a13a40385265038';

  let sdk: Client;

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
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Can get me', async () => {
    const mockToken = 'mockToken';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });
    nock(`${apiHost}${USER_BASE}`).get('/me').reply(200, userData);

    const user = await sdk.users.me();

    expect(user.id);
  });

  it('Can get user by id', async () => {
    nock(`${apiHost}${USER_BASE}`).get(`/${userId}`).reply(200, userData);

    const user = await sdk.users.findById(userId);

    expect(user.id);
  });

  it('Can not get user by id', async () => {
    expect.assertions(1);
    nock(`${apiHost}${USER_BASE}`)
      .get(`/${userId}`)
      .reply(404, resourceUnknownError);

    try {
      await sdk.users.findById(userId);
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceUnknownError);
    }
  });

  it('Can update a user', async () => {
    const newData = {
      firstName: 'aaaaa',
      lastName: 'bbbbb',
    };

    nock(`${apiHost}${USER_BASE}`)
      .put(`/${userId}`)
      .reply(200, {
        ...updatedUserData,
        ...newData,
      });

    const user = await sdk.users.update(userId, newData);

    expect(user.firstName).toBe('aaaaa');
    expect(user.lastName).toBe('bbbbb');
  });

  it('Can not update a user', async () => {
    nock(`${apiHost}${USER_BASE}`)
      .put(`/${userId}`)
      .reply(404, resourceUnknownError);

    try {
      await sdk.users.update(userId, {});
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceUnknownError);
    }
  });

  it('Can get users list', async () => {
    const rql = '?select(firstName,id)&sort(-firstName)';
    nock(`${apiHost}${USER_BASE}`).get(`/${rql}`).reply(200, userResponse);

    const users = await sdk.users.find(rql);

    expect(users.data.length).toBeGreaterThan(0);
  });

  it('Can get patients list', async () => {
    nock(`${apiHost}${USER_BASE}`)
      .get('/patients')
      .reply(200, patientsResponse);

    const patients = await sdk.users.patients();

    expect(patients.length).toBeGreaterThan(0);
  });

  it('Can get staff list', async () => {
    nock(`${apiHost}${USER_BASE}`).get('/staff').reply(200, staffResponse);

    const staff = await sdk.users.staff();

    expect(staff.length).toBeGreaterThan(0);
  });

  it('Can remove a user', async () => {
    nock(`${apiHost}${USER_BASE}`)
      .delete(`/${userId}`)
      .reply(200, { recordsAffected: 1 });

    const result = await sdk.users.remove(userId);

    expect(result).toEqual({ recordsAffected: 1 });
  });

  it('Can update a users email', async () => {
    nock(`${apiHost}${USER_BASE}`)
      .put(`/${userId}/email`)
      .reply(200, {
        ...updatedUserData,
        email: newEmail,
      });

    const user = await sdk.users.updateEmail(userId, { email: newEmail });

    expect(user.email).toBe(newEmail);
  });

  it('Add a patient enlistment to a user', async () => {
    nock(`${apiHost}${USER_BASE}`)
      .post(`/${userId}/patient_enlistments`)
      .reply(200, { recordsAffected: 1 });

    const result = await sdk.users.addPatientEnlistment(userId, { groupId });

    expect(result).toEqual({ recordsAffected: 1 });
  });

  it('Can remove a patient enlistment from a user', async () => {
    nock(`${apiHost}${USER_BASE}`)
      .delete(`/${userId}/patient_enlistments/${groupId}`)
      .reply(200, { recordsAffected: 1 });

    const result = await sdk.users.removePatientEnlistment(userId, groupId);

    expect(result).toEqual({ recordsAffected: 1 });
  });

  it('Can register a new user', async () => {
    nock(`${apiHost}${USER_BASE}`)
      .post('/register')
      .reply(200, {
        ...newUserData,
        id: userId,
      });

    const newUser = await sdk.users.createAccount(newUserData);

    expect(newUser.id).toBeDefined();
  });

  it('Can update a users password', async () => {
    nock(`${apiHost}${USER_BASE}`).put(`/password`).reply(200, userData);

    const result = await sdk.users.changePassword({ oldPassword, newPassword });

    expect(result.id).toEqual(userData.id);
  });

  it('Can authenticate', async () => {
    nock(`${apiHost}${USER_BASE}`)
      .post('/authenticate')
      .reply(200, {
        ...newUserData,
        id: userId,
      });

    const authenticatedUser = await sdk.users.authenticate({
      email: newEmail,
      password: newPassword,
    });

    expect(authenticatedUser.id).toBeDefined();
  });

  it('Can request activation mail', async () => {
    nock(`${apiHost}${USER_BASE}`)
      .get(`/activation?email=${newEmail}`)
      .reply(200);

    const result = await sdk.users.requestEmailActivation(newEmail);

    expect(result).toBeDefined();
  });

  it('Can complete an email activation', async () => {
    nock(`${apiHost}${USER_BASE}`).post('/activation').reply(200);

    const result = await sdk.users.validateEmailActivation({ hash });

    expect(result).toBeDefined();
  });

  it('Can request a password reset', async () => {
    nock(`${apiHost}${USER_BASE}`)
      .get(`/forgot_password?email=${newEmail}`)
      .reply(200);

    const result = await sdk.users.requestPasswordReset(newEmail);

    expect(result).toBeDefined();
  });

  it('Can complete a password reset', async () => {
    nock(`${apiHost}${USER_BASE}`).post('/forgot_password').reply(200);

    const result = await sdk.users.validatePasswordReset({ hash, newPassword });

    expect(result).toBeDefined();
  });

  it('Confirm the password for the user making the request', async () => {
    nock(`${apiHost}${USER_BASE}`).post('/confirm_password').reply(200);

    const result = await sdk.users.confirmPassword({ password: newPassword });

    expect(result).toBeDefined();
  });

  it('Can check if email is available', async () => {
    nock(`${apiHost}${USER_BASE}`)
      .get(`/email_available?email=${newEmail}`)
      .reply(200, {
        emailAvailable: true,
      });

    const result = await sdk.users.isEmailAvailable(newEmail);

    expect(result).toEqual({ emailAvailable: true });
  });
});
