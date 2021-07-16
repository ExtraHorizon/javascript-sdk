import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { FileTokensService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): FileTokensService => ({
  /**
   * Delete a token
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param token
   * @param tokenToAccess The token that should be deleted
   * @returns void
   * @throws {InvalidTokenError}
   * @throws {UnauthorizedTokenError}
   * @throws {TokenNotDeleteableError}
   */
  async deleteToken(token, tokenToAccess, options) {
    await client.delete(httpAuth, `/${token}/tokens/${tokenToAccess}`, options);
  },

  /**
   * Generate a token for a file
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param token
   * @param requestBody
   * @returns TokenObject Success
   * @throws {InvalidTokenError}
   * @throws {UnauthorizedTokenError}
   */
  async generateToken(token, requestBody, options) {
    return (
      await client.post(httpAuth, `/${token}/tokens`, requestBody, options)
    ).data;
  },
});
