import * as crypto from 'crypto';
import { OidcProviderCreation } from '../../src/models/oidc/Providers';

export const generateRandomName = () =>
  `${crypto.randomBytes(5).toString('hex')}-${crypto
    .randomBytes(5)
    .toString('hex')}`;
export const createProviderData = (
  data?: Partial<OidcProviderCreation>
): OidcProviderCreation => ({
  name: `${crypto.randomBytes(5).toString('hex')}-${crypto
    .randomBytes(5)
    .toString('hex')}`,
  authorizationEndpoint: 'https://www.auth-service.com/authorization',
  clientId: 'my-awesome-client-id',
  clientSecret: 'dont-tell-anyone',
  tokenEndpoint: 'https://www.auth-service.com/token',
  issuerId: 'https://www.auth-service.com',
  redirectUri: 'http://exh.dev.com/redirect',
  userinfoEndpoint: 'https://www.auth-service.com/userinfo',
  description: 'A mock auth service',
  ...data,
});
