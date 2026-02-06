import { HttpInstance } from '../../../../http/types';
import {
  addPagersFn,
  findAllGeneric,
  findAllIterator,
} from '../../../helpers';
import { HttpClient } from '../../../http-client';
import { OptionsWithRql } from '../../../types';
import { LoginAttempt, LoginAttemptsService } from './types';

export default (
  oidcClient: HttpClient,
  httpWithAuth: HttpInstance
): LoginAttemptsService => {
  async function query(options: OptionsWithRql) {
    const { data } = await oidcClient.get(
      httpWithAuth,
      `/oidc/loginAttempts${options?.rql || ''}`,
      options
    );
    return data;
  }

  return {
    async find(options) {
      const result = await query(options);
      return addPagersFn<LoginAttempt>(query, options, result);
    },

    async findAll(options) {
      return findAllGeneric<LoginAttempt>(query, options);
    },

    findAllIterator(options) {
      return findAllIterator<LoginAttempt>(query, options);
    },

    async findFirst(options) {
      const result = await query(options);
      return result.data[0];
    },
  };
};
