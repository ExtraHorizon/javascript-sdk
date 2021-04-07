import {
  ResourceUnknownError,
  ApiError,
  HttpError,
  FieldFormatError,
  UnsupportedResponseTypeError,
  NoPermissionError,
  CallbackNotValidError,
  UserNotAuthenticatedError,
  EmptyBodyError,
  NotEnoughMfaMethodsError,
  InvalidMfaCodeError,
} from './errors';

const ErrorClassDefinitionsMap = {
  10: NoPermissionError,
  13: EmptyBodyError,
  15: FieldFormatError,
  16: ResourceUnknownError,
  104: UserNotAuthenticatedError,
  113: CallbackNotValidError,
  114: UnsupportedResponseTypeError,
  130: InvalidMfaCodeError,
  133: NotEnoughMfaMethodsError,
};

export function typeReceivedError(error: HttpError) {
  const ErrorClassDefinition =
    ErrorClassDefinitionsMap[error?.response?.data?.code];

  if (!ErrorClassDefinition) {
    return new ApiError(error);
  }

  return new ErrorClassDefinition(error);
}
