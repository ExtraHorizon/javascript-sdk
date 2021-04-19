import {
  ResourceUnknownError,
  ResourceAlreadyExistsException,
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
  MissingRequiredFieldsException,
  IllegalArgumentException,
  PasswordException,
  EmailUsedException,
  EmailUnknownException,
  AlreadyActivatedException,
  ActivationUnknownException,
  InvalidTokenException,
  UnauthorizedTokenException,
  TokenNotDeleteableException,
  FileTooLargeException,
} from './errors';

const ErrorClassDefinitionsMap = {
  10: NoPermissionError,
  13: EmptyBodyError,
  14: MissingRequiredFieldsException,
  15: FieldFormatError,
  16: ResourceUnknownError,
  17: ResourceAlreadyExistsException,
  26: IllegalArgumentException,
  104: UserNotAuthenticatedError,
  106: AuthenticationError,
  113: CallbackNotValidError,
  114: UnsupportedResponseTypeError,
  130: InvalidMfaCodeError,
  132: InvalidPresenceTokenError,
  133: NotEnoughMfaMethodsError,
  202: EmailUnknownException,
  203: EmailUsedException,
  205: ActivationUnknownException,
  206: AlreadyActivatedException,
  208: PasswordException,
  211: LoginTimeoutError,
  212: LoginFreezeError,
  213: TooManyFailedAttemptsError,
  2605: InvalidTokenException,
  2606: UnauthorizedTokenException,
  2607: TokenNotDeleteableException,
  2610: FileTooLargeException,
};

export function typeReceivedError(error: HttpError) {
  const ErrorClassDefinition =
    ErrorClassDefinitionsMap[error?.response?.data?.code];

  if (!ErrorClassDefinition) {
    return new ApiError(error);
  }

  return new ErrorClassDefinition(error);
}
