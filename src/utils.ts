import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { ClientConfig, ClientParams } from './types';
import { AUTH_BASE } from './constants';

function hmacSha1Hash(baseString: string, key: string) {
  return crypto.createHmac('sha1', key).update(baseString).digest('base64');
}

export function validateConfig({
  apiHost: rawApiHost,
  ...params
}: ClientParams): ClientConfig {
  const validApiHostEnd = rawApiHost.endsWith('/')
    ? rawApiHost.substr(0, rawApiHost.length - 1)
    : rawApiHost;

  const configBase = {
    ...params,
    apiHost: validApiHostEnd.startsWith('https://')
      ? validApiHostEnd
      : `https://${validApiHostEnd}`,
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
