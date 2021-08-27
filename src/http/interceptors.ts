import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { DATA_BASE } from '../constants';
import { HttpResponseError } from './types';
import { camelizeKeys, recursiveMap, recursiveRenameKeys } from './utils';

export const retryInterceptor =
  (axios: AxiosInstance) =>
  (error: HttpResponseError): unknown => {
    const { config } = error;
    const { retry } = config;

    // tries includes the initial try. So 5 tries equals 4 retries
    if (
      error?.isAxiosError &&
      retry?.tries > retry?.current &&
      retry?.retryCondition(error)
    ) {
      return new Promise(resolve =>
        setTimeout(
          () =>
            resolve(
              axios({
                ...config,
                retry: {
                  ...retry,
                  current: retry.current + 1,
                },
              } as AxiosRequestConfig)
            ),
          retry.retryTimeInMs
        )
      );
    }

    return Promise.reject(error);
  };

export const camelizeResponseData = ({
  data,
  config,
  ...response
}: AxiosResponse): AxiosResponse => ({
  ...response,
  config,
  data:
    // Note: the /data endpoint can return custom properties that the user has defined
    config?.url?.startsWith(DATA_BASE) ||
    ['arraybuffer', 'stream'].includes(config.responseType ?? '')
      ? data
      : camelizeKeys(data),
});

const mapDateValues = (value, key) => {
  if (
    [
      'creationTimestamp',
      'expiryTimestamp',
      'expireTimestamp',
      'updateTimestamp',
      'lastFailedTimestamp',
      'statusChangedTimestamp',
      'startTimestamp',
      'timestamp',
      'originalPurchaseDate',
      'lastPurchaseDate',
      'expiresDate',
      'reevaluateDate',
      'autoRenewStatusChange',
    ].includes(key)
  ) {
    return new Date(value);
  }
  return value;
};

export const transformResponseData = ({
  data,
  config,
  ...response
}: AxiosResponse): AxiosResponse => ({
  ...response,
  config,
  data: ['arraybuffer', 'stream'].includes(config?.responseType ?? '')
    ? data
    : recursiveMap(mapDateValues)(data),
});

const convertRecordsAffectedKeys = key => {
  if (['records_affected', 'recordsAffected'].includes(key)) {
    return 'affectedRecords';
  }
  return key;
};

export const transformKeysResponseData = ({
  data,
  config,
  ...response
}: AxiosResponse): AxiosResponse => ({
  ...response,
  config,
  data: ['arraybuffer', 'stream'].includes(config?.responseType ?? '')
    ? data
    : recursiveRenameKeys(convertRecordsAffectedKeys, data),
});
