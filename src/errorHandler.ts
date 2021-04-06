import {
  ResourceUnknownError,
  ApiError,
  HttpError,
  FieldFormatError,
  UnsupportedResponseTypeError,
  NoPermissionExceptionError,
  CallbackNotValidError,
} from './errors';

const ErrorClassDefinitionsMap = {
  10: NoPermissionExceptionError,
  15: FieldFormatError,
  16: ResourceUnknownError,
  113: CallbackNotValidError,
  114: UnsupportedResponseTypeError,
};

export function typeReceivedError(error: HttpError) {
  const ErrorClassDefinition =
    ErrorClassDefinitionsMap[error?.response?.data?.code];

  if (!ErrorClassDefinition) {
    return new ApiError(error);
  }

  return new ErrorClassDefinition(error);
}
