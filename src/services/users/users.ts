import type { HttpInstance } from '../../types';
import { Results } from '../types';
import type { UsersService } from './types';
import { HttpClient } from '../http-client';

export default (
  userClient: HttpClient,
  httpWithAuth: HttpInstance
): UsersService => ({
  async me(options) {
    return (await userClient.get(httpWithAuth, '/me', options)).data;
  },

  async findById(userId, options) {
    return (await userClient.get(httpWithAuth, `/${userId}`, options)).data;
  },

  async update(userId, userData, options) {
    return (await userClient.put(httpWithAuth, `/${userId}`, userData, options))
      .data;
  },

  async find(options) {
    return (
      await userClient.get(httpWithAuth, `/${options?.rql || ''}`, options)
    ).data;
  },

  async findFirst(options) {
    const res = await this.find(options);
    return res.data[0];
  },

  async removeUsers(rql, options) {
    return (await userClient.delete(httpWithAuth, `/${rql}`, options)).data;
  },

  async patients(options) {
    return (
      await userClient.get(
        httpWithAuth,
        `/patients${options?.rql || ''}`,
        options
      )
    ).data;
  },

  async staff(options) {
    return (
      await userClient.get(httpWithAuth, `/staff${options?.rql || ''}`, options)
    ).data;
  },

  async remove(userId, options) {
    return (await userClient.delete(httpWithAuth, `/${userId}`, options)).data;
  },

  async updateEmail(userId, requestBody, options) {
    return (
      await userClient.put(
        httpWithAuth,
        `/${userId}/email`,
        requestBody,
        options
      )
    ).data;
  },

  async addPatientEnlistment(userId, requestBody, options) {
    return (
      await userClient.post(
        httpWithAuth,
        `/${userId}/patient_enlistments`,
        requestBody,
        options
      )
    ).data;
  },

  async removePatientEnlistment(userId, groupId, options) {
    return (
      await userClient.delete(
        httpWithAuth,
        `/${userId}/patient_enlistments/${groupId}`,
        options
      )
    ).data;
  },

  async createAccount(requestBody, options) {
    return (
      await userClient.post(httpWithAuth, '/register', requestBody, options)
    ).data;
  },

  async changePassword(requestBody, options) {
    return (
      await userClient.put(httpWithAuth, '/password', requestBody, options)
    ).data;
  },

  async authenticate(requestBody, options) {
    return (
      await userClient.post(httpWithAuth, '/authenticate', requestBody, options)
    ).data;
  },

  async requestEmailActivation(email, options) {
    return (
      (
        await userClient.get(httpWithAuth, '/activation', {
          ...options,
          params: {
            email,
          },
        })
      ).status === Results.Success
    );
  },

  async validateEmailActivation(requestBody, options) {
    return (
      (await userClient.post(httpWithAuth, '/activation', requestBody, options))
        .status === Results.Success
    );
  },

  async requestPasswordReset(email, options) {
    return (
      (
        await userClient.get(httpWithAuth, '/forgot_password', {
          ...options,
          params: {
            email,
          },
        })
      ).status === Results.Success
    );
  },

  async validatePasswordReset(requestBody, options) {
    const result = await userClient.post(
      httpWithAuth,
      '/forgot_password',
      requestBody,
      options
    );
    return result.status === Results.Success;
  },

  async confirmPassword(requestBody, options) {
    const result = await userClient.post(
      httpWithAuth,
      '/confirm_password',
      requestBody,
      options
    );
    return result.status === Results.Success;
  },

  async isEmailAvailable(email, options) {
    return (
      await userClient.get(httpWithAuth, '/email_available', {
        ...options,
        params: {
          email,
        },
      })
    ).data;
  },

  async updateProfileImage(userId, requestBody, options) {
    console.warn('updateProfileImage method is deprecated in swagger');
    return (
      await userClient.put(
        httpWithAuth,
        `/${userId}/profile_image`,
        requestBody,
        options
      )
    ).data;
  },

  async deleteProfileImage(userId, options) {
    return (
      await userClient.delete(httpWithAuth, `/${userId}/profile_image`, options)
    ).data;
  },
});
