import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { delay } from '../utils';
import { DATA_BASE } from '../constants';
import { HttpRequestConfig, HttpResponse, HttpResponseError } from './types';
import {
  camelizeKeys,
  decamelizeKeys,
  recursiveMap,
  recursiveRenameKeys,
} from './utils';
import { typeReceivedError } from '../errorHandler';
import { HttpError } from '../errors';

export const retryInterceptor =
  (axios: AxiosInstance) =>
  async (error: HttpResponseError): Promise<unknown> => {
    const { config } = error;
    const { retry } = config;

    // tries includes the initial try. So 5 tries equals 4 retries
    if (
      error?.isAxiosError &&
      retry?.tries > retry?.current &&
      retry?.retryCondition(error)
    ) {
      await delay(retry.retryTimeInMs);

      return axios({
        ...config,
        retry: {
          ...retry,
          current: retry.current + 1,
        },
      } as AxiosRequestConfig);
    }

    return Promise.reject(error);
  };

export const camelizeResponseData = ({
  data,
  config,
  ...response
}: HttpResponse): HttpResponse => ({
  ...response,
  config,
  data:
    // Note: the /data endpoint can return custom properties that the user has defined
    config?.url?.startsWith(DATA_BASE) ||
    ['arraybuffer', 'stream'].includes(config.responseType ?? '') ||
    config?.interceptors?.skipCamelizeResponseData
      ? data
      : camelizeKeys(
          data,
          config?.normalizeCustomPropertyCasing ? [] : config?.customProperties
        ),
});

export const decamilizeRequestData = (
  data,
  httpRequestConfig?: HttpRequestConfig
) =>
  decamelizeKeys(
    data,
    httpRequestConfig?.normalizeCustomPropertyCasing
      ? []
      : httpRequestConfig?.customProperties
  );

const mapDateValues = (value, key) => {
  if (
    [
      'creationTimestamp',
      'expiryTimestamp',
      'expireTimestamp',
      'nextTimestamp',
      'updateTimestamp',
      'lastFailedTimestamp',
      'statusChangedTimestamp',
      'startTimestamp',
      'endTimestamp',
      'timestamp',
      'paidTimestamp',
      'originalPurchaseDate',
      'lastPurchaseDate',
      'expiresDate',
      'reevaluateDate',
      'autoRenewStatusChange',
      'commentedTimestamp',
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
}: HttpResponse): HttpResponse => ({
  ...response,
  config,
  data:
    ['arraybuffer', 'stream'].includes(config?.responseType ?? '') ||
    config?.interceptors?.skipTransformResponseData
      ? data
      : recursiveMap(mapDateValues, config?.url?.startsWith(DATA_BASE))(data),
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
}: HttpResponse): HttpResponse => ({
  ...response,
  config,
  data:
    ['arraybuffer', 'stream'].includes(config?.responseType ?? '') ||
    config?.interceptors?.skipTransformKeysResponseData
      ? data
      : recursiveRenameKeys(convertRecordsAffectedKeys, data, []),
});

export const typeReceivedErrorsInterceptor = async (error: HttpError) => {
  // Only needed if it's an axiosError, otherwise it's already typed
  if (error && error.isAxiosError) {
    throw typeReceivedError(error);
  }
  throw error;
};
