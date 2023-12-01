import { HttpInstance } from '../../../../http/types';
import { addPagersFn, findAllGeneric, findAllIterator } from '../../../helpers';
import { HttpClient } from '../../../http-client';
import { OptionsWithRql } from '../../../types';
import { OidcProvider, OidcProviderService } from './types';

export default (
  oidcClient: HttpClient,
  httpWithAuth: HttpInstance
): OidcProviderService => {
  async function query(options: OptionsWithRql) {
    const { data } = await oidcClient.get(
      httpWithAuth,
      `/oidc/providers${options?.rql || ''}`,
      options
    );
    return data;
  }

  return {
    async create(body) {
      const { data } = await oidcClient.post(
        httpWithAuth,
        `/oidc/providers`,
        body
      );
      return data;
    },

    async find(options) {
      const result = await query(options);
      return addPagersFn<OidcProvider>(query, options, result);
    },

    async findAll(options?: OptionsWithRql) {
      return findAllGeneric<OidcProvider>(query, options);
    },

    findAllIterator(options?: OptionsWithRql) {
      return findAllIterator<OidcProvider>(query, options);
    },

    async findFirst(options?: OptionsWithRql) {
      const result = await query(options);
      return result.data[0];
    },

    async update(providerId, body) {
      const { data } = await oidcClient.put(
        httpWithAuth,
        `/oidc/providers/${providerId}`,
        body
      );
      return data;
    },

    async enable(providerId: string) {
      const { data } = await oidcClient.post(
        httpWithAuth,
        `/oidc/providers/${providerId}/enable`,
        {}
      );
      return data;
    },

    async disable(providerId: string) {
      const { data } = await oidcClient.post(
        httpWithAuth,
        `/oidc/providers/${providerId}/disable`,
        {}
      );
      return data;
    },

    async delete(providerId) {
      const { data } = await oidcClient.delete(
        httpWithAuth,
        `/oidc/providers/${providerId}`
      );
      return data;
    },
  };
};
