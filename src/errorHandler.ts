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

const cleanHeaders = (headers: Record<string, any>) =>
  headers && headers.Authorization
    ? {
        ...headers,
        Authorization: `Bearer ${`...${headers.Authorization.substr(-5)}`}`,
      }
    : headers;

export function fallbackError(error) {
  const { config, response } = error;
  const data = response?.data;

  const errorData: {
    status?: number;
    statusText?: string;
    requestId?: string;
    message: string;
    details: Record<string, any>;
    request?: Record<string, any>;
  } = {
    status: response?.status,
    statusText: response?.statusText,
    message: data && 'message' in data ? data.message : '',
    details: data && 'details' in data ? data.details : {},
    request: config
      ? {
          url: config.url,
          headers: cleanHeaders(config.headers), // Obscure the Authorization token
          method: config.method,
          payloadData: config.data,
        }
      : {},
  };

  return new Error(JSON.stringify(errorData, null, '  '));
}
