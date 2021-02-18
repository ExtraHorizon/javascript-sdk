import { QError } from '@qompium/q-errors';
import { MissingRequiredFieldsError, ResourceUnknownError } from './errors';
import {
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
} from './users/errors';

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

export function typeReceivedError(error) {
  if (!(error instanceof QError)) {
    return new Error('Generic error: could not find any instance of QError...');
  }

  const ErrorClassDefinition = ErrorClassDefinitions.find(
    definition => error.qName === definition.qName
  );

  if (!ErrorClassDefinition) {
    return new Error('Generic error: could not find any ErrorClassDefinition...');
  }

  return new ErrorClassDefinition(error);
}
