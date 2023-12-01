import { Base64 } from 'crypto-es/lib/enc-base64';
import { HmacSHA1 } from 'crypto-es/lib/sha1';
import * as qs from 'qs';
import { TokenDataOauth1 } from './types';

interface OAuth1RequestInformation {
  method: string;
  url: string;
  consumer: { key: string; secret: string };
  tokenData?: Pick<TokenDataOauth1, 'key' | 'secret'>;
}

interface OAuth1Parameters {
  oauth_consumer_key: string;
  oauth_signature_method: 'HMAC-SHA1';
  oauth_token: string;
  oauth_timestamp: number;
  oauth_nonce: string;
  oauth_version: '1.0';
  oauth_signature?: string;
}

// All the oAuth parameters above plus the querystring key value pairs
type ExtendedOAuth1Parameters = OAuth1Parameters & object;

// Same construct as in the auth service without the realm check and including the nonce and timestamp
export function getOAuth1AuthorizationHeader(
  requestInformation: OAuth1RequestInformation
) {
  const { method, url, consumer, tokenData } = requestInformation;
  const { baseUrl, searchParameters } = getUrlInfoFromRequest(url);

  const nonce = generateNonce();
  const timeStamp = getTimeStamp();

  const parameters: OAuth1Parameters = {
    oauth_consumer_key: consumer.key,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_token: tokenData?.key,
    oauth_timestamp: timeStamp,
    oauth_nonce: nonce,
    oauth_version: '1.0',
  };

  if (!parameters.oauth_token) {
    delete parameters.oauth_token;
  }

  const signatureParameters: ExtendedOAuth1Parameters = {
    ...searchParameters,
    ...parameters,
  };

  const signature = generateSignature(
    method,
    baseUrl,
    signatureParameters,
    consumer.secret,
    tokenData?.secret
  );

  const header = generateAuthHeader({
    oauth_signature: signature,
    ...parameters,
  });

  return header;
}

// Copied and improved version of https://github.com/request/oauth-sign/blob/18a2513da6ba7a2c0cd8179170d7c296c7625137/index.js#L79
// Replaced the crypto version of the hmacSha1Hash with the one already used here
function generateSignature(
  httpMethod: string,
  baseUri: string,
  params: ExtendedOAuth1Parameters,
  consumerSecret: string,
  tokenSecret?: string
) {
  const base = generateBase(httpMethod, baseUri, params);
  const key = [consumerSecret || '', tokenSecret || '']
    .map(percentEncode)
    .join('&');

  return HmacSHA1(base, key).toString(Base64);
}

// Copied and linted version of oauth-sign https://github.com/request/oauth-sign/blob/18a2513da6ba7a2c0cd8179170d7c296c7625137/index.js#L44
function generateBase(
  httpMethod: string,
  baseUri: string,
  params: ExtendedOAuth1Parameters
) {
  // adapted from https://dev.twitter.com/docs/auth/oauth and
  // https://dev.twitter.com/docs/auth/creating-signature

  // Parameter normalization
  // http://tools.ietf.org/html/rfc5849#section-3.4.1.3.2
  const normalized = map(params)
    // 1.  First, the name and value of each parameter are encoded
    .map(p => [percentEncode(p[0]), percentEncode(p[1] || '')])
    // 2.  The parameters are sorted by name, using ascending byte value
    //     ordering.  If two or more parameters share the same name, they
    //     are sorted by their value.
    .sort((a, b) => compare(a[0], b[0]) || compare(a[1], b[1]))
    // 3.  The name of each parameter is concatenated to its corresponding
    //     value using an "=" character (ASCII code 61) as a separator, even
    //     if the value is empty.
    .map(p => p.join('='))
    // 4.  The sorted name/value pairs are concatenated together into a
    //     single string by using an "&" character (ASCII code 38) as
    //     separator.
    .join('&');

  const base = [
    percentEncode(httpMethod ? httpMethod.toUpperCase() : 'GET'),
    percentEncode(baseUri),
    percentEncode(normalized),
  ].join('&');

  return base;
}

// Linted version of https://github.com/ddo/oauth-1.0a/blob/8c24a413ab36c7cd049d34a3d2d16996f24da0ad/oauth-1.0a.js#L319
function generateNonce() {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let result = '';
  for (let i = 0; i < 32; i += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

// Copied and improved function from oauth1.0a https://github.com/ddo/oauth-1.0a/blob/8c24a413ab36c7cd049d34a3d2d16996f24da0ad/oauth-1.0a.js#L294
// Improvements includes:
//  - Inlining the sorting
//  - Removing the check if there is a realm since we don't use it
//  - Replacing the weird for-loop and substring concept with a map & join
//  - Removed the filtering on no oath_parameters since they will all be oAuth
function generateAuthHeader(oAuthData: OAuth1Parameters) {
  const parameterSeparator = ', ';
  const sortedKeys = Object.keys(oAuthData).sort();

  const headerStart = 'OAuth ';
  const headerValue = sortedKeys
    .map(key => `${percentEncode(key)}="${percentEncode(oAuthData[key])}"`)
    .join(parameterSeparator);

  return {
    Authorization: headerStart + headerValue,
  };
}

// Same function used in the auth-service
function getUrlInfoFromRequest(url: string) {
  const { protocol, host, pathname, search } = new URL(url);

  return {
    baseUrl: `${protocol}//${host}${pathname}`,
    searchParameters: qs.parse(
      search.startsWith('?') ? search.slice(1) : search
    ),
  };
}

// Util functions

// Copied from oauth1.0a https://github.com/call203/oauth-1.0a/blob/0673c1bcd4d0cbcd7f2854dee555d55631610b0c/oauth-1.0a.js#L303
// Same function was present in oauth-sign https://github.com/request/oauth-sign/blob/18a2513da6ba7a2c0cd8179170d7c296c7625137/index.js#L11
// Preferred the name of the function in oauth1.0a
function percentEncode(str: string) {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/\*/g, '%2A')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

// Improved version of https://github.com/ddo/oauth-1.0a/blob/8c24a413ab36c7cd049d34a3d2d16996f24da0ad/oauth-1.0a.js#L334
function getTimeStamp() {
  return Math.floor(Date.now() / 1000);
}

// Improved version of oauth-sign https://github.com/request/oauth-sign/blob/18a2513da6ba7a2c0cd8179170d7c296c7625137/index.js#L40
// Compare function for sort
function compare(a: string, b: string) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}

// Copied and linted version of oauth-sign https://github.com/request/oauth-sign/blob/18a2513da6ba7a2c0cd8179170d7c296c7625137/index.js#L23
// Maps object to bi-dimensional array
// Converts { foo: 'A', bar: [ 'b', 'B' ]} to
// [ ['foo', 'A'], ['bar', 'b'], ['bar', 'B'] ]
function map(obj: object) {
  const arr = [];
  for (const [key, val] of Object.entries(obj)) {
    if (Array.isArray(val))
      for (let i = 0; i < val.length; i += 1) arr.push([key, val[i]]);
    else if (typeof val === 'object')
      for (const [propKey, propValue] of Object.entries(val)) {
        arr.push([`${key}[${propKey}]`, propValue]);
      }
    else arr.push([key, val]);
  }
  return arr;
}
