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
  MfaRequiredError,
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
  MfaReattemptDelayError,
  LockedDocumentError,
  OauthTokenError,
  OauthKeyError,
  LocalizationKeyMissingError,
  TemplateFillingError,
  NotActivatedError,
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
  107: OauthKeyError,
  108: OauthTokenError,
  113: CallbackNotValidError,
  114: UnsupportedResponseTypeError,
  129: MfaRequiredError,
  130: InvalidMfaCodeError,
  132: InvalidPresenceTokenError,
  133: NotEnoughMfaMethodsError,
  134: MfaReattemptDelayError,
  202: EmailUnknownError,
  203: EmailUsedError,
  204: NotActivatedError,
  205: ActivationUnknownError,
  206: AlreadyActivatedError,
  208: PasswordError,
  211: LoginTimeoutError,
  212: LoginFreezeError,
  213: TooManyFailedAttemptsError,
  414: StatusInUseError,
  415: LockedDocumentError,
  1002: LocalizationKeyMissingError,
  1003: TemplateFillingError,
  2605: InvalidTokenError,
  2606: UnauthorizedTokenError,
  2607: TokenNotDeleteableError,
  2610: FileTooLargeError,
};

const ErrorClassDifinitionsByErrorMap = {
  invalid_grant: InvalidGrantError,
  mfa_required: MfaRequiredError,
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
