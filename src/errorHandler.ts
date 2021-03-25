import { QError } from '@qompium/q-errors';
import {
  MissingRequiredFieldsError,
  ResourceUnknownError,
  ResourceAlreadyExistsError,
  AuthenticationError,
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

export function typeReceivedError(error: any) {
  if (!(error instanceof QError)) {
    return error;
  }

  const ErrorClassDefinition = ErrorClassDefinitions.find(
    definition => error?.qName === definition.qName
  );

  if (!ErrorClassDefinition) {
    return error;
  }

  return new ErrorClassDefinition(error);
}
