import {
  MissingRequiredFieldsError,
  ResourceUnknownError,
  ResourceAlreadyExistsError,
  AuthenticationError,
  ApiError,
} from './errors';
import {
  EmailUsedError,
  EmailUnknownError,
  NotActivatedError,
  ActivationUnknownError,
  AlreadyActivatedError,
  NewPasswordHashUnknownError,
  PasswordError,
  LoginTimeoutError,
  LoginFreezeError,
  TooManyFailedAttemptsError,
} from './endpoints/users/errors';

const ErrorClassDefinitions = [
  ResourceUnknownError,
  MissingRequiredFieldsError,
  EmailUsedError,
  AuthenticationError,
  EmailUnknownError,
  ResourceAlreadyExistsError,
  NotActivatedError,
  ActivationUnknownError,
  AlreadyActivatedError,
  NewPasswordHashUnknownError,
  PasswordError,
  LoginTimeoutError,
  LoginFreezeError,
  TooManyFailedAttemptsError,
];

export function typeReceivedError(error: any) {
  const ErrorClassDefinition = ErrorClassDefinitions.find(
    definition => error?.qName === definition.qName
  );

  if (!ErrorClassDefinition) {
    return new ApiError(error);
  }

  return new ErrorClassDefinition(error);
}
