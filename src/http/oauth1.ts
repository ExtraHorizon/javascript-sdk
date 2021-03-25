import * as AxiosLogger from 'axios-logger';
import axios, { AxiosInstance } from 'axios';
import { Config } from '../types';
import { TokenDataOauth1 } from './types';
import { cleanData } from './utils';

export const addAuth = (
  http: AxiosInstance,
  options: Config,
  authConfig: Record<string, any>
) => {
  let tokenData: TokenDataOauth1;

  const httpWithAuth = axios.create({ ...http.defaults });

  if (options.debug) {
    httpWithAuth.interceptors.request.use(
      AxiosLogger.requestLogger,
      AxiosLogger.errorLogger
    );
    httpWithAuth.interceptors.response.use(
      AxiosLogger.responseLogger,
      AxiosLogger.errorLogger
    );
  }

  const authenticate = async () => {
    const tokenResult = await http.post(authConfig.path, authConfig.params, {
      ...{
        headers: {
          ...authConfig.oauth1.toHeader(
            authConfig.oauth1.authorize({
              url: options.apiHost + authConfig.path,
              method: 'POST',
            })
          ),
          'Content-Type': 'application/json',
        },
      },
    });
    tokenData = authConfig.oauth1 && {
      ...tokenResult.data,
      key: tokenResult.data.token,
      secret: tokenResult.data.tokenSecret,
    };
    return tokenData;
  };

  httpWithAuth.interceptors.request.use(async config => ({
    ...config,
    headers: {
      ...config.headers,
      ...{
        'Content-Type': 'application/json',
        ...authConfig.oauth1.toHeader(
          authConfig.oauth1.authorize(
            {
              url: config.baseURL + config.url,
              method: config.method,
            },
            tokenData || (await authenticate())
          )
        ),
      },
    },
  }));

  httpWithAuth.interceptors.response.use(cleanData);
  return httpWithAuth;
};
