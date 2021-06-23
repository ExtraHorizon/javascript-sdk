import OAuth from 'oauth-1.0a';
import CryptoES from 'crypto-es';
import { ClientConfig, ClientParams } from './types';
import { AUTH_BASE } from './constants';

function hmacSha1Hash(baseString: string, key: string) {
  return CryptoES.HmacSHA1(baseString, key).toString(CryptoES.enc.Base64);
}

export function validateConfig({
  host: rawHost,
  ...params
}: ClientParams): ClientConfig {
  const validHostEnd = rawHost.endsWith('/')
    ? rawHost.substr(0, rawHost.length - 1)
    : rawHost;

  const configBase = {
    ...params,
    host: `https://api.${validHostEnd
      .replace('https://', '')
      .replace('http://', '')
      .replace('api.', '')}`,
  };

  if ('consumerKey' in params) {
    // oauth1
    return {
      ...configBase,
      path: `${AUTH_BASE}/oauth1/tokens`,
      oauth1: new OAuth({
        consumer: {
          key: params.consumerKey,
          secret: params.consumerSecret,
        },
        signature_method: 'HMAC-SHA1',
        hash_function: hmacSha1Hash,
      }),
    };
  }

  return {
    ...configBase,
    path: `${AUTH_BASE}/oauth2/tokens`,
    params: {
      client_id: params.clientId,
    },
  };
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
