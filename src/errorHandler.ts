import {
  ApiError,
  ErrorClassMap,
  HttpError,
  OAuth2ErrorClassMap,
} from './errors';

export function typeReceivedError(error: HttpError) {
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
