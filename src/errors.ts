type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH';

interface RequestConfig {
  url?: string;
  method?: Method;
  baseURL?: string;
  headers?: any;
  params?: any;
  data?: any;
}

interface Response<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: RequestConfig;
  request?: any;
}

export interface HttpError<T = any> extends Error {
  config: RequestConfig;
  code?: string;
  request?: any;
  response?: Response<T>;
  isAxiosError: boolean;
  toJSON: () => Record<string, unknown>;
}

const cleanHeaders = (headers: Record<string, any>) =>
  headers && headers.Authorization
    ? {
        ...headers,
        Authorization: `Bearer ${`...${headers.Authorization.substr(-5)}`}`,
      }
    : headers;

export class ApiError {
  public qName: string;

  public readonly error?: string;

  public readonly message?: string;

  public readonly status?: number;

  public readonly statusText?: string;

  public readonly request?: Record<string, any>;

  public readonly response?: Record<string, any>;

  constructor(error: HttpError) {
    const { config, response } = error;
    this.qName = response?.data?.name;
    this.status = response?.status;
    this.statusText = response?.statusText;
    this.error = response?.data.error || response?.data.name;
    this.message = response?.data.description || response?.data.message;
    this.response = {
      ...response?.data,
    };
    this.request = config
      ? {
          url: config.url,
          headers: cleanHeaders(config.headers), // Obscure the Authorization token
          method: config.method,
          payloadData: config.data,
        }
      : {};
  }
}

export class ResourceUnknownError extends ApiError {}
export class ResourceAlreadyExistsException extends ApiError {}

export class FieldFormatError extends ApiError {}
export class UnsupportedResponseTypeError extends ApiError {}
export class NoPermissionError extends ApiError {}
export class CallbackNotValidError extends ApiError {}
export class UserNotAuthenticatedError extends ApiError {}
export class EmptyBodyError extends ApiError {}
export class NotEnoughMfaMethodsError extends ApiError {}
export class InvalidMfaCodeError extends ApiError {}
export class AuthenticationError extends ApiError {}
export class LoginTimeoutError extends ApiError {}
export class LoginFreezeError extends ApiError {}
export class TooManyFailedAttemptsError extends ApiError {}
export class InvalidPresenceTokenError extends ApiError {}
export class IllegalArgumentException extends ApiError {}
export class MissingRequiredFieldsException extends ApiError {}
export class PasswordException extends ApiError {}
export class EmailUsedException extends ApiError {}
export class EmailUnknownException extends ApiError {}
export class AlreadyActivatedException extends ApiError {}
export class ActivationUnknownException extends ApiError {}
export class InvalidTokenException extends ApiError {}
export class UnauthorizedTokenException extends ApiError {}
export class TokenNotDeleteableException extends ApiError {}
export class FileTooLargeException extends ApiError {}
