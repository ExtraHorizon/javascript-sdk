import * as OAuth from 'oauth-1.0a';
import * as crypto from 'crypto';
import { qErrorFromResponse } from '@qompium/q-errors';
import { AxiosError } from 'axios';
import { camelizeKeys } from 'humps';
import { typeReceivedError, fallbackError } from '../errorHandler';

export const errorLogger = (error: AxiosError) => {
  const qError = qErrorFromResponse(error.response.data, error.response.status);
  if (qError) {
    throw typeReceivedError(qError);
  } else {
    console.log('fall');
    throw fallbackError(error);
  }
};

function hmacSha1Hash(baseString: string, key: string) {
  return crypto.createHmac('sha1', key).update(baseString).digest('base64');
}

export const parseAuthParams = options => {
  if ('consumerKey' in options) {
    // oauth1
    return {
      path: '/auth/v2/oauth1/tokens',
      params: {
        email: options.email,
        password: options.password,
      },
      oauth1: new OAuth({
        consumer: {
          key: options.consumerKey,
          secret: options.consumerSecret,
        },
        signature_method: 'HMAC-SHA1',
        hash_function: hmacSha1Hash,
      }),
    };
  }

  if ('username' in options) {
    // oauth2
    return {
      path: '/auth/v2/oauth2/token',
      params: {
        grant_type: 'password',
        client_id: options.clientId,
        username: options.username,
        password: options.password,
      },
    };
  }

  if ('code' in options) {
    // oauth2
    return {
      path: '/auth/v2/oauth2/token',
      params: {
        grant_type: 'authorization_code',
        client_id: options.clientId,
      },
    };
  }
  return {};
};

export const cleanData = res =>
  res
    ? {
        ...res,
        data: camelizeKeys(res.data),
      }
    : res;
