import OAuth from 'oauth-1.0a';

import { HmacSHA1 } from 'crypto-es/lib/sha1';
import { Base64 } from 'crypto-es/lib/enc-base64';
import { ClientConfig, ClientParams, GlobalPermissionName } from './types';
import { AUTH_BASE } from './constants';

function hmacSha1Hash(baseString: string, key: string) {
  return HmacSHA1(baseString, key).toString(Base64);
}

function parseHost(rawHost: string, prefix: 'api' | 'apx') {
  const validHostEnd = rawHost.endsWith('/')
    ? rawHost.substring(0, rawHost.length - 1)
    : rawHost;

  return validHostEnd.includes('localhost')
    ? validHostEnd
    : `https://${prefix}.${validHostEnd
        .replace(/^https?:\/\//, '')
        .replace(/^api\./, '')
        .replace(/^apx\./, '')}`;
}

export function validateConfig({
  host: rawHost,
  ...params
}: ClientParams): ClientConfig {
  if ('consumerKey' in params) {
    // oauth1
    return {
      ...params,
      host: parseHost(rawHost, 'api'),
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

  if ('clientId' in params) {
    return {
      ...params,
      host: parseHost(rawHost, 'api'),
      path: `${AUTH_BASE}/oauth2/tokens`,
      params: {
        client_id: params.clientId,
        ...(params.clientSecret ? { client_secret: params.clientSecret } : {}),
      },
    };
  }

  return {
    ...params,
    host: parseHost(rawHost, 'apx'),
  };
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export function parseGlobalPermissions(
  permissions: string[]
): GlobalPermissionName[] {
  const GlobalPermissionNameValues = Object.values(GlobalPermissionName);

  return permissions
    .map(element => {
      if (!GlobalPermissionNameValues.includes(GlobalPermissionName[element])) {
        console.warn(`${element} is not a valid permission.`);
      }
      return GlobalPermissionName[element];
    })
    .filter(element => element);
}
