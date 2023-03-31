import { HttpClient } from '../../../http-client';
import { HttpInstance } from '../../../../http/types';
import { LoginAttempt, LoginAttemptsService } from './types';
import { OptionsWithRql, PagedResultWithPager } from '../../../types';
import {
  addPagersFn,
  findAllGeneric,
  findAllIterator,
  FindAllIterator,
} from '../../../helpers';

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
    async find(
      options?: OptionsWithRql
    ): Promise<PagedResultWithPager<LoginAttempt>> {
      const result = await query(options);
      return addPagersFn<LoginAttempt>(query, options, result);
    },

    async findAll(options?: OptionsWithRql): Promise<LoginAttempt[]> {
      return findAllGeneric<LoginAttempt>(query, options);
    },

    findAllIterator(options?: OptionsWithRql): FindAllIterator<LoginAttempt> {
      return findAllIterator<LoginAttempt>(query, options);
    },

    async findFirst(options?: OptionsWithRql): Promise<LoginAttempt> {
      const result = await query(options);
      return result.data[0];
    },
  };
};
