import type { HttpInstance } from '../../types';
import type { TokenObject, CreateTokenRequest, Token } from './types';

export default (userClient, httpAuth: HttpInstance) => ({
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
  async deleteToken(token: Token, tokenToAccess: Token): Promise<void> {
    await userClient.delete(httpAuth, `/${token}/tokens/${tokenToAccess}`);
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
  async generateToken(
    token: Token,
    requestBody?: CreateTokenRequest
  ): Promise<TokenObject> {
    return (await userClient.post(httpAuth, `/${token}/tokens`, requestBody))
      .data;
  },
});
