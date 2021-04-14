import type { HttpInstance } from '../../types';

// FIXME missing types
type TokenObject = unknown;
type CreateTokenRequest = unknown;
type Token = unknown;

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
   * @throws {400 Error}
   * @throws {401 Error}
   * @throws {403 Error}
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
   * @throws {400 Error}
   * @throws {401 Error}
   */
  async generateToken(
    token: Token,
    requestBody?: CreateTokenRequest
  ): Promise<TokenObject> {
    return (await userClient.post(httpAuth, `/${token}/tokens`, requestBody))
      .data;
  },
});
