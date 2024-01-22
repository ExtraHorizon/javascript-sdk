import type { HttpInstance } from '../../types';
import { addPagersFn, findAllGeneric, findAllIterator } from '../helpers';
import { HttpClient } from '../http-client';
import { Results } from '../types';
import type { User, UsersService } from './types';

export default (
  userClient: HttpClient,
  httpWithAuth: HttpInstance,
  http: HttpInstance
): UsersService => {
  async function find(options) {
    return (
      await userClient.get(httpWithAuth, `/${options?.rql || ''}`, options)
    ).data;
  }

  return {
    async me(options) {
      return (await userClient.get(httpWithAuth, '/me', options)).data;
    },

    async findById(userId, options) {
      return (await userClient.get(httpWithAuth, `/${userId}`, options)).data;
    },

    async update(userId, userData, options) {
      return (
        await userClient.put(httpWithAuth, `/${userId}`, userData, options)
      ).data;
    },

    async find(options) {
      const result = await find(options);
      return addPagersFn<User>(find, options, result);
    },

    async findAll(options) {
      return findAllGeneric<User>(find, options);
    },

    findAllIterator(options) {
      return findAllIterator<User>(find, options);
    },

    async findFirst(this: UsersService, options) {
      const res = await find(options);
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
        await userClient.get(
          httpWithAuth,
          `/staff${options?.rql || ''}`,
          options
        )
      ).data;
    },

    async remove(userId, options) {
      return (await userClient.delete(httpWithAuth, `/${userId}`, options))
        .data;
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
      return (await userClient.post(http, '/register', requestBody, options))
        .data;
    },

    async changePassword(requestBody, options) {
      return (
        await userClient.put(httpWithAuth, '/password', requestBody, options)
      ).data;
    },

    async authenticate(requestBody, options) {
      return (
        await userClient.post(
          httpWithAuth,
          '/authenticate',
          requestBody,
          options
        )
      ).data;
    },

    async requestEmailActivation(email, options) {
      return (
        (
          await userClient.get(http, '/activation', {
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
        (
          await userClient.post(
            httpWithAuth,
            '/activation',
            requestBody,
            options
          )
        ).status === Results.Success
      );
    },

    async requestPasswordReset(email, options) {
      return (
        (
          await userClient.get(http, '/forgot_password', {
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
        await userClient.get(http, '/email_available', {
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
        await userClient.delete(
          httpWithAuth,
          `/${userId}/profile_image`,
          options
        )
      ).data;
    },

    async passwordPolicy(options) {
      const { data: passwordPolicy } = await userClient.get(
        httpWithAuth,
        '/password_policy',
        options
      );

      let regEx = '^\\S*'; // no whitespaces
      let messageFormat = '{{format}}';

      if (
        passwordPolicy &&
        passwordPolicy?.minimumLength &&
        passwordPolicy?.maximumLength
      ) {
        regEx = `([^\\s]){${passwordPolicy.minimumLength},${passwordPolicy.maximumLength}}`;
        messageFormat = '{{length}}';
        if (passwordPolicy?.lowerCaseRequired) {
          regEx = `(?=.*[a-z])${regEx}`;
          messageFormat += ', {{lowerCaseRequired}}';
        }
        if (passwordPolicy?.upperCaseRequired) {
          regEx = `(?=.*[A-Z])${regEx}`;
          messageFormat += ', {{upperCaseRequired}}';
        }
        if (passwordPolicy?.numberRequired) {
          regEx = `(?=.*\\d)${regEx}`;
          messageFormat += ', {{numberRequired}}';
        }
        if (passwordPolicy?.symbolRequired) {
          regEx +=
            '([`~\\!@#\\$%\\^\\&\\*\\(\\)\\-_\\=\\+\\[\\{\\}\\]\\\\|;:\\\'",<.>\\/\\?€£¥₹§±].*)';
          messageFormat += ', {{symbolRequired}}';
        }
        const lastIndex = messageFormat.lastIndexOf(',');
        if (lastIndex > 0) {
          messageFormat = `${messageFormat.substring(
            0,
            lastIndex
          )} {{and}}${messageFormat.substring(lastIndex + 1)}`;
        }
        messageFormat = `${messageFormat}.`;
      }
      return {
        ...passwordPolicy,
        pattern: `^${regEx}$`,
        messageFormat,
      };
    },

    async updatePasswordPolicy(requestBody, options) {
      return (
        await userClient.put(
          httpWithAuth,
          '/password_policy',
          requestBody,
          options
        )
      ).data;
    },

    async getEmailTemplates(options) {
      const { data } = await userClient.get(
        httpWithAuth,
        '/email_templates',
        options
      );

      return data;
    },

    async setEmailTemplates(templates) {
      const { data } = await userClient.put(
        httpWithAuth,
        '/email_templates',
        templates
      );

      return data;
    },
  };
};
