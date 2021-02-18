import { ApiError } from '../errors';

export class EmailUsedError extends ApiError {
  static qName = 'EMAIL_USED_EXCEPTION';
}

export class AuthenticationException extends ApiError {
  static qName: 'AUTHENTICATION_EXCEPTION';
};

export class EmailUnknownException extends ApiError {
  static qName: 'EMAIL_UNKNOWN_EXCEPTION';
};

export class ResourceAlreadyExistsException extends ApiError {
  static qName: 'RESOURCE_ALREADY_EXISTS_EXCEPTION';
};

export class NotActivatedException extends ApiError {
  static qName: 'NOT_ACTIVATED_EXCEPTION';
};

export class ActivationUnknownException extends ApiError {
  static qName: 'ACTIVATION_UNKNOWN_EXCEPTION';
};

export class AlreadyActivatedException extends ApiError {
  static qName: 'ALREADY_ACTIVATED_EXCEPTION';
};

export class NewPasswordHashUnknownException extends ApiError {
  static qName: 'NEW_PASSWORD_HASH_UNKNOWN_EXCEPTION';
};

export class PasswordException extends ApiError {
  static qName: 'PASSWORD_EXCEPTION';
};

export class LoginTimeoutException extends ApiError {
  static qName: 'LOGIN_TIMEOUT_EXCEPTION';
};

export class LoginFreezeException extends ApiError {
  static qName: 'LOGIN_FREEZE_EXCEPTION';
};

export class TooManyFailedAttemptsException extends ApiError {
  static qName: 'TOO_MANY_FAILED_ATTEMPTS_EXCEPTION';
};
