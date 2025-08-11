import axios from 'axios';
import { ApiError, ErrorClassMap, OAuth2ErrorClassMap, RequestAbortedError } from './errors';

export function typeReceivedError(error: any) {
  if (axios.isCancel(error)) {
    return new RequestAbortedError();
  }

  const ErrorClass = ErrorClassMap[error?.response?.data?.code];

  if (ErrorClass) {
    return ErrorClass.createFromHttpError(error);
  }

  const OAuth2ErrorClass = OAuth2ErrorClassMap[error?.response?.data?.error];

  if (OAuth2ErrorClass) {
    return OAuth2ErrorClass.createFromHttpError(error);
  }

  return ApiError.createFromHttpError(error);
}
