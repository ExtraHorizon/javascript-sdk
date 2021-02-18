import { ApiError } from '../errors';

export class EmailUsedError extends ApiError {
  static qName = 'EMAIL_USED_EXCEPTION';
}

export class AuthenticationError extends ApiError {
  static qName: 'AUTHENTICATION_EXCEPTION';
}

export class EmailUnknownError extends ApiError {
  static qName: 'EMAIL_UNKNOWN_EXCEPTION';
}

export class ResourceAlreadyExistsError extends ApiError {
  static qName: 'RESOURCE_ALREADY_EXISTS_EXCEPTION';
}

export class NotActivatedError extends ApiError {
  static qName: 'NOT_ACTIVATED_EXCEPTION';
}

export class ActivationUnknownError extends ApiError {
  static qName: 'ACTIVATION_UNKNOWN_EXCEPTION';
}

export class AlreadyActivatedError extends ApiError {
  static qName: 'ALREADY_ACTIVATED_EXCEPTION';
}

export class NewPasswordHashUnknownError extends ApiError {
  static qName: 'NEW_PASSWORD_HASH_UNKNOWN_EXCEPTION';
}

export class PasswordError extends ApiError {
  static qName: 'PASSWORD_EXCEPTION';
}

export class LoginTimeoutError extends ApiError {
  static qName: 'LOGIN_TIMEOUT_EXCEPTION';
}

export class LoginFreezeError extends ApiError {
  static qName: 'LOGIN_FREEZE_EXCEPTION';
}

export class TooManyFailedAttemptsError extends ApiError {
  static qName: 'TOO_MANY_FAILED_ATTEMPTS_EXCEPTION';
}
