import { AxiosResponse } from 'axios';
import { camelizeKeys, recursiveMap, recursiveRenameKeys } from './utils';

export const camelizeResponseData = ({
  data,
  config,
  ...response
}: AxiosResponse): AxiosResponse => ({
  ...response,
  config,
  data: ['arraybuffer', 'stream'].includes(config.responseType)
    ? data
    : camelizeKeys(data),
});

const mapFunction = (value, key) => {
  if (
    [
      'creationTimestamp',
      'expiryTimestamp',
      'updateTimestamp',
      'lastFailedTimestamp',
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
  data: ['arraybuffer', 'stream'].includes(config.responseType)
    ? data
    : recursiveMap(mapFunction)(data),
});

const keyFunction = key => {
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
  data: ['arraybuffer', 'stream'].includes(config.responseType)
    ? data
    : recursiveRenameKeys(keyFunction, data),
});
