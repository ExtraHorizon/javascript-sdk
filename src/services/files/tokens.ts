import type { HttpInstance } from '../../types';
import type {
  TokenObject,
  CreateTokenRequest,
  Token,
  FileTokensService,
} from './types';

export default (userClient, httpAuth: HttpInstance): FileTokensService => ({
  async deleteToken(token: Token, tokenToAccess: Token): Promise<void> {
    await userClient.delete(httpAuth, `/${token}/tokens/${tokenToAccess}`);
  },

  async generateToken(
    token: Token,
    requestBody: CreateTokenRequest
  ): Promise<TokenObject> {
    return (await userClient.post(httpAuth, `/${token}/tokens`, requestBody))
      .data;
  },
});
