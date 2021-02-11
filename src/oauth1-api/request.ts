import { isErrorResponse, qErrorFromResponse } from '@qompium/q-errors';
import axios, { AxiosRequestConfig } from 'axios';
import * as crypto from 'crypto';
import { camelizeKeys } from 'humps';
import * as OAuth from 'oauth-1.0a';
import { RequestLogger } from './logger';
import { ApiRequestOptions, OauthKeyPair } from './models';

export async function apiRequest(options: ApiRequestOptions) {
  const {
    url,
    method,
    data,
    timeout,
    rawResponse,
    headers,
    oauthConsumer,
    oauthToken,
  } = options;

  const config: AxiosRequestConfig = {
    url,
    method,
    data,
    timeout,
    responseType: rawResponse ? 'arraybuffer' : undefined,
    headers: headers || {
      'Content-Type': 'application/json',
    },
  };

  config.headers = signRequestConfig(config, oauthConsumer, oauthToken);

  const requestLogger = new RequestLogger(method, url);
  try {
    const response = await axios.request(config);

    requestLogger.end(response.status);

    if (response.data) {
      return camelizeKeys(response.data) as any;
    }
    return { status: response.status };
  } catch (error) {
    const status = error && error.response && error.response.status;
    requestLogger.end(status);

    if (!status || !error.response.data || !isErrorResponse(error.response.data)) {
      throw error;
    }

    throw qErrorFromResponse(error.response.data, error.response.status);
  }
}

function signRequestConfig(config: AxiosRequestConfig, oauthConsumer: OauthKeyPair, oauthToken: OauthKeyPair) {
  if (!oauthConsumer || !oauthConsumer.key || !oauthConsumer.secret) {
    return config.headers;
  }

  const requestData = {
    url: config.url,
    method: config.method,
  };

  const oauthSigner = new OAuth({
    consumer: oauthConsumer,
    realm: undefined,
    signature_method: 'HMAC-SHA1',
    hash_function: hmacSha1Hash,
  });

  const oauthAuthorization = oauthSigner.authorize(requestData, oauthToken);
  const headers = config.headers || {};

  return { ...headers, ...oauthSigner.toHeader(oauthAuthorization) };
}

function hmacSha1Hash(baseString: string, key: string) {
  return crypto.createHmac('sha1', key).update(baseString).digest('base64');
}
