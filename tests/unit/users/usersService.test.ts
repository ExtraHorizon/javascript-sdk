import nock from 'nock';
import { AUTH_BASE, USER_BASE } from '../../../src/constants';
import {
  ForgotPasswordRequestLimitError,
  ForgotPasswordRequestTimeoutError,
  IllegalStateError,
  IncorrectPinCodeError,
  NewPasswordPinCodeUnknownError,
  PinCodesNotEnabledError,
  ResourceUnknownError,
  TooManyFailedAttemptsError,
} from '../../../src/errors';
import {
  Client,
  createClient,
  ParamsOauth2,
  rqlBuilder,
} from '../../../src/index';
import {
  newPasswordPolicy,
  newUserData,
  passwordPolicy,
  resourceUnknownError,
  updatedUserData,
  userData,
} from '../../__helpers__/user';
import { createPagedResponse, randomHexString } from '../../__helpers__/utils';

describe('Users Service', () => {
  const host = 'https://api.dev.fibricheck.com';
  const userId = '5a0b2adc265ced65a8cab865';
  const groupId = '5bfbfc3146e0fb321rsa4b28';
  // const oldEmail = 'old@bbb.ccc';
  const newEmail = 'new@bbb.ccc';
  const oldPassword = 'OldPass123';
  const newPassword = 'NewPass123';
  const hash = 'bced43a8ccb74868536ae8bc5a13a40385265038';

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

  it('should get me', async () => {
    const mockToken = 'mockToken';
    nock(host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });
    nock(`${host}${USER_BASE}`).get('/me').reply(200, userData);

    const user = await sdk.users.me();

    expect(user.id);
  });

  it('should find the first user', async () => {
    nock(`${host}${USER_BASE}`)
      .get('/')
      .reply(200, createPagedResponse(userData));

    const user = await sdk.users.findFirst();

    expect(user.id);
  });

  it('should get user by id', async () => {
    nock(`${host}${USER_BASE}`).get(`/${userId}`).reply(200, userData);

    const user = await sdk.users.findById(userId);

    expect(user.id);
  });

  it('throws on find user by unknown id', async () => {
    expect.assertions(1);
    nock(`${host}${USER_BASE}`)
      .get(`/${userId}`)
      .reply(404, resourceUnknownError);

    try {
      await sdk.users.findById(userId);
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceUnknownError);
    }
  });

  it('should update a user', async () => {
    const newData = {
      firstName: 'aaaaa',
      lastName: 'bbbbb',
    };

    nock(`${host}${USER_BASE}`)
      .put(`/${userId}`)
      .reply(200, {
        ...updatedUserData,
        ...newData,
      });

    const user = await sdk.users.update(userId, newData);

    expect(user.firstName).toBe('aaaaa');
    expect(user.lastName).toBe('bbbbb');
  });

  it('should not update a user', async () => {
    nock(`${host}${USER_BASE}`)
      .put(`/${userId}`)
      .reply(404, resourceUnknownError);

    try {
      await sdk.users.update(userId, {});
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceUnknownError);
    }
  });

  it('should get users list', async () => {
    const rql = rqlBuilder()
      .select(['firstName', 'id'])
      .sort('-firstName')
      .build();
    nock(`${host}${USER_BASE}`)
      .get(`/${rql}`)
      .reply(200, createPagedResponse(userData));

    const users = await sdk.users.find({ rql });

    expect(users.data.length).toBeGreaterThan(0);
  });

  it('should get patients list', async () => {
    nock(`${host}${USER_BASE}`)
      .get('/patients')
      .reply(200, createPagedResponse(userData));

    const patients = await sdk.users.patients();

    expect(patients.data.length).toBeGreaterThan(0);
  });

  it('should get staff list', async () => {
    nock(`${host}${USER_BASE}`)
      .get('/staff')
      .reply(200, createPagedResponse(userData));

    const staff = await sdk.users.staff();

    expect(staff.data.length).toBeGreaterThan(0);
  });

  it('should remove a user', async () => {
    nock(`${host}${USER_BASE}`)
      .delete(`/${userId}`)
      .reply(200, { affectedRecords: 1 });

    const result = await sdk.users.remove(userId);

    expect(result).toEqual({ affectedRecords: 1 });
  });

  it('should update a users email', async () => {
    nock(`${host}${USER_BASE}`)
      .put(`/${userId}/email`)
      .reply(200, {
        ...updatedUserData,
        email: newEmail,
      });

    const user = await sdk.users.updateEmail(userId, { email: newEmail });

    expect(user.email).toBe(newEmail);
  });

  it('should add a patient enlistment to a user', async () => {
    nock(`${host}${USER_BASE}`)
      .post(`/${userId}/patient_enlistments`)
      .reply(200, { affectedRecords: 1 });

    const result = await sdk.users.addPatientEnlistment(userId, { groupId });

    expect(result).toEqual({ affectedRecords: 1 });
  });

  it('should remove a patient enlistment from a user', async () => {
    nock(`${host}${USER_BASE}`)
      .delete(`/${userId}/patient_enlistments/${groupId}`)
      .reply(200, { affectedRecords: 1 });

    const result = await sdk.users.removePatientEnlistment(userId, groupId);

    expect(result).toEqual({ affectedRecords: 1 });
  });

  it('should register a new user', async () => {
    nock(`${host}${USER_BASE}`)
      .post('/register')
      .reply(200, {
        ...newUserData,
        id: userId,
      });

    const newUser = await sdk.users.createAccount(newUserData);

    expect(newUser.id).toBeDefined();
  });

  it('should update a users password', async () => {
    nock(`${host}${USER_BASE}`).put(`/password`).reply(200, userData);

    const result = await sdk.users.changePassword({ oldPassword, newPassword });

    expect(result.id).toEqual(userData.id);
  });

  it('should authenticate', async () => {
    nock(`${host}${USER_BASE}`)
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

  it('should request activation mail', async () => {
    nock(`${host}${USER_BASE}`).get(`/activation?email=${newEmail}`).reply(200);

    const result = await sdk.users.requestEmailActivation(newEmail);

    expect(result).toBeDefined();
  });

  it('should complete an email activation', async () => {
    nock(`${host}${USER_BASE}`).post('/activation').reply(200);

    const result = await sdk.users.validateEmailActivation({ hash });

    expect(result).toBeDefined();
  });

  it('should confirm the password for the user making the request', async () => {
    nock(`${host}${USER_BASE}`).post('/confirm_password').reply(200);

    const result = await sdk.users.confirmPassword({ password: newPassword });

    expect(result).toBeDefined();
  });

  it('should check if email is available', async () => {
    nock(`${host}${USER_BASE}`)
      .get(`/email_available?email=${newEmail}`)
      .reply(200, {
        emailAvailable: true,
      });

    const result = await sdk.users.isEmailAvailable(newEmail);

    expect(result).toEqual({ emailAvailable: true });
  });

  it('should upload profile image', async () => {
    nock(`${host}${USER_BASE}`)
      .put(`/${userId}/profile_image`)
      .reply(200, userData);

    const result = await sdk.users.updateProfileImage(userId, { hash: 'xxx' });

    expect(result).toBeDefined();
  });

  it('should get password policy', async () => {
    nock(`${host}${USER_BASE}`)
      .get(`/password_policy`)
      .reply(200, passwordPolicy);

    const result = await sdk.users.passwordPolicy();

    expect(result.minimumLength).toBeDefined();
  });

  it('should update password policy', async () => {
    nock(`${host}${USER_BASE}`)
      .put(`/password_policy`)
      .reply(200, passwordPolicy);

    const result = await sdk.users.updatePasswordPolicy(newPasswordPolicy);

    expect(result.minimumLength).toBeDefined();
  });

  it('Gets the email template configuration', async () => {
    const data = {
      activationEmailTemplateId: randomHexString(24),
      reactivationEmailTemplateId: randomHexString(24),
      passwordResetEmailTemplateId: randomHexString(24),
      oidcUnlinkEmailTemplateId: randomHexString(24),
      oidcUnlinkPinEmailTemplateId: randomHexString(24),
      activationPinEmailTemplateId: randomHexString(24),
      reactivationPinEmailTemplateId: randomHexString(24),
      passwordResetPinEmailTemplateId: randomHexString(24),
    };

    const snakeCasedData = {
      activation_email_template_id: data.activationEmailTemplateId,
      reactivation_email_template_id: data.reactivationEmailTemplateId,
      password_reset_email_template_id: data.passwordResetEmailTemplateId,
      oidc_unlink_email_template_id: data.oidcUnlinkEmailTemplateId,
      oidc_unlink_pin_email_template_id: data.oidcUnlinkPinEmailTemplateId,
      activation_pin_email_template_id: data.activationPinEmailTemplateId,
      reactivation_pin_email_template_id: data.reactivationPinEmailTemplateId,
      password_reset_pin_email_template_id: data.passwordResetPinEmailTemplateId,
    };

    nock(`${host}${USER_BASE}`)
      .get('/email_templates')
      .reply(200, snakeCasedData);

    const result = await sdk.users.getEmailTemplates();
    expect(result).toStrictEqual(data);
  });

  it('Sets the email template configuration', async () => {
    const data = {
      activationEmailTemplateId: randomHexString(24),
      reactivationEmailTemplateId: randomHexString(24),
      passwordResetEmailTemplateId: randomHexString(24),
      oidcUnlinkEmailTemplateId: randomHexString(24),
      oidcUnlinkPinEmailTemplateId: randomHexString(24),
      activationPinEmailTemplateId: randomHexString(24),
      reactivationPinEmailTemplateId: randomHexString(24),
      passwordResetPinEmailTemplateId: randomHexString(24),
    };

    const snakeCasedData = {
      activation_email_template_id: data.activationEmailTemplateId,
      reactivation_email_template_id: data.reactivationEmailTemplateId,
      password_reset_email_template_id: data.passwordResetEmailTemplateId,
      oidc_unlink_email_template_id: data.oidcUnlinkEmailTemplateId,
      oidc_unlink_pin_email_template_id: data.oidcUnlinkPinEmailTemplateId,
      activation_pin_email_template_id: data.activationPinEmailTemplateId,
      reactivation_pin_email_template_id: data.reactivationPinEmailTemplateId,
      password_reset_pin_email_template_id: data.passwordResetPinEmailTemplateId,
    };

    nock(`${host}${USER_BASE}`)
      .put('/email_templates', snakeCasedData)
      .reply(200, snakeCasedData);

    const result = await sdk.users.setEmailTemplates(data);
    expect(result).toStrictEqual(data);
  });

  describe('requestPasswordReset()', () => {
    it('Requests a password reset', async () => {
      nock(`${host}${USER_BASE}`)
        .get(`/forgot_password?email=${newEmail}`)
        .reply(200);

      const result = await sdk.users.requestPasswordReset(newEmail);

      expect(result).toBe(true);
    });

    it('Requests a pin code password reset', async () => {
      nock(`${host}${USER_BASE}`)
        .get(`/forgot_password?email=${newEmail}&mode=pin_code`)
        .reply(200);

      const result = await sdk.users.requestPasswordReset({
        email: newEmail,
        mode: 'pin_code',
      });

      expect(result).toBe(true);
    });

    it('Throws an IllegalStateError', async () => {
      nock(`${host}${USER_BASE}`)
        .get(`/forgot_password?email=${newEmail}`)
        .reply(400, { code: 27 });

      const promise = sdk.users.requestPasswordReset(newEmail);

      await expect(promise).rejects.toBeInstanceOf(IllegalStateError);
    });

    it('Throws a PinCodesNotEnabledError', async () => {
      nock(`${host}${USER_BASE}`)
        .get(`/forgot_password?email=${newEmail}&mode=pin_code`)
        .reply(403, { code: 218 });

      const promise = sdk.users.requestPasswordReset({
        email: newEmail,
        mode: 'pin_code',
      });

      await expect(promise).rejects.toBeInstanceOf(PinCodesNotEnabledError);
    });

    it('Throws a ForgotPasswordRequestLimitError', async () => {
      nock(`${host}${USER_BASE}`)
        .get(`/forgot_password?email=${newEmail}`)
        .reply(403, { code: 220 });

      const promise = sdk.users.requestPasswordReset(newEmail);

      await expect(promise).rejects.toBeInstanceOf(ForgotPasswordRequestLimitError);
    });

    it('Throws a ForgotPasswordRequestTimeoutError', async () => {
      nock(`${host}${USER_BASE}`)
        .get(`/forgot_password?email=${newEmail}`)
        .reply(403, { code: 221 });

      const promise = sdk.users.requestPasswordReset(newEmail);

      await expect(promise).rejects.toBeInstanceOf(ForgotPasswordRequestTimeoutError);
    });
  });

  describe('validatePasswordReset()', () => {
    it('Completes a hash password reset', async () => {
      nock(`${host}${USER_BASE}`)
        .post('/forgot_password', {
          hash,
          new_password: newPassword,
        })
        .reply(200, {});

      const result = await sdk.users.validatePasswordReset({ hash, newPassword });
      expect(result).toBe(true);
    });

    it('Completes a pin code password reset', async () => {
      const email = 'john@example.com';
      const pinCode = '12345678';

      nock(`${host}${USER_BASE}`)
        .post('/forgot_password', {
          email,
          pin_code: pinCode,
          new_password: newPassword,
        })
        .reply(200, {});

      const result = await sdk.users.validatePasswordReset({
        email,
        pinCode,
        newPassword,
      });
      expect(result).toBe(true);
    });

    it('Throws a NewPasswordPinCodeUnknownError', async () => {
      const email = 'john@example.com';
      const pinCode = '12345678';

      nock(`${host}${USER_BASE}`)
        .post('/forgot_password', {
          email,
          pin_code: pinCode,
          new_password: newPassword,
        })
        .reply(400, { code: 219 });

      const promise = sdk.users.validatePasswordReset({
        email,
        pinCode,
        newPassword,
      });
      await expect(promise).rejects.toBeInstanceOf(NewPasswordPinCodeUnknownError);
    });

    it('Throws a TooManyFailedAttemptsError', async () => {
      const email = 'john@example.com';
      const pinCode = '12345678';

      nock(`${host}${USER_BASE}`)
        .post('/forgot_password', {
          email,
          pin_code: pinCode,
          new_password: newPassword,
        })
        .reply(400, { code: 213 });

      const promise = sdk.users.validatePasswordReset({
        email,
        pinCode,
        newPassword,
      });
      await expect(promise).rejects.toBeInstanceOf(TooManyFailedAttemptsError);
    });

    it('Throws an IncorrectPinCodeError', async () => {
      const email = 'john@example.com';
      const pinCode = '12345678';

      nock(`${host}${USER_BASE}`)
        .post('/forgot_password', {
          email,
          pin_code: pinCode,
          new_password: newPassword,
        })
        .reply(400, { code: 224 });

      const promise = sdk.users.validatePasswordReset({
        email,
        pinCode,
        newPassword,
      });
      await expect(promise).rejects.toBeInstanceOf(IncorrectPinCodeError);
    });
  });
});
