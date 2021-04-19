import {
  ResourceUnknownError,
  ResourceAlreadyExistsError,
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
  AuthenticationError,
  LoginTimeoutError,
  LoginFreezeError,
  TooManyFailedAttemptsError,
  InvalidPresenceTokenError,
  MissingRequiredFieldsError,
  IllegalArgumentError,
  PasswordError,
  EmailUsedError,
  EmailUnknownError,
  AlreadyActivatedError,
  ActivationUnknownError,
  InvalidTokenError,
  UnauthorizedTokenError,
  TokenNotDeleteableError,
  FileTooLargeError,
} from './errors';

const ErrorClassDefinitionsMap = {
  10: NoPermissionError,
  13: EmptyBodyError,
  14: MissingRequiredFieldsError,
  15: FieldFormatError,
  16: ResourceUnknownError,
  17: ResourceAlreadyExistsError,
  26: IllegalArgumentError,
  104: UserNotAuthenticatedError,
  106: AuthenticationError,
  113: CallbackNotValidError,
  114: UnsupportedResponseTypeError,
  130: InvalidMfaCodeError,
  132: InvalidPresenceTokenError,
  133: NotEnoughMfaMethodsError,
  202: EmailUnknownError,
  203: EmailUsedError,
  205: ActivationUnknownError,
  206: AlreadyActivatedError,
  208: PasswordError,
  211: LoginTimeoutError,
  212: LoginFreezeError,
  213: TooManyFailedAttemptsError,
  2605: InvalidTokenError,
  2606: UnauthorizedTokenError,
  2607: TokenNotDeleteableError,
  2610: FileTooLargeError,
};

export function typeReceivedError(error: HttpError) {
  const ErrorClassDefinition =
    ErrorClassDefinitionsMap[error?.response?.data?.code];

  if (!ErrorClassDefinition) {
    return new ApiError(error);
  }

  return new ErrorClassDefinition(error);
}
