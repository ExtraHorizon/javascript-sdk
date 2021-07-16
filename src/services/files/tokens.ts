import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { FileTokensService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): FileTokensService => ({
  async deleteToken(token, tokenToAccess, options) {
    await client.delete(httpAuth, `/${token}/tokens/${tokenToAccess}`, options);
  },

  async generateToken(token, requestBody, options) {
    return (
      await client.post(httpAuth, `/${token}/tokens`, requestBody, options)
    ).data;
  },
});
