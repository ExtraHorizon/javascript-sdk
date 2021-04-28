import {
  ServerError,
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
  InvalidGrantError,
  MFARequiredError,
  MissingRequiredFieldsError,
  IllegalArgumentError,
  IllegalStateError,
  PasswordError,
  EmailUsedError,
  EmailUnknownError,
  AlreadyActivatedError,
  ActivationUnknownError,
  InvalidTokenError,
  UnauthorizedTokenError,
  TokenNotDeleteableError,
  FileTooLargeError,
  StatusInUseError,
} from './errors';

export const ErrorClassDefinitionsMap = {
  1: ServerError,
  10: NoPermissionError,
  13: EmptyBodyError,
  14: MissingRequiredFieldsError,
  15: FieldFormatError,
  16: ResourceUnknownError,
  17: ResourceAlreadyExistsError,
  26: IllegalArgumentError,
  27: IllegalStateError,
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
  414: StatusInUseError,
  2605: InvalidTokenError,
  2606: UnauthorizedTokenError,
  2607: TokenNotDeleteableError,
  2610: FileTooLargeError,
};

const ErrorClassDifinitionsByErrorMap = {
  invalid_grant: InvalidGrantError,
  mfa_required: MFARequiredError,
};

export function typeReceivedError(error: HttpError) {
  const ErrorClassDefinition =
    ErrorClassDefinitionsMap[error?.response?.data?.code];

  if (ErrorClassDefinition) {
    return new ErrorClassDefinition(error);
  }

  const ErrorClassDefinitionByCode =
    ErrorClassDifinitionsByErrorMap[error?.response?.data?.error];

  if (ErrorClassDefinitionByCode) {
    return new ErrorClassDefinitionByCode(error);
  }

  return new ApiError(error);
}
