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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Response<T = any> {
  data: T;
  status: number;
  statusText: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers: any;
  config: RequestConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request?: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface HttpError<T = any> extends Error {
  config: RequestConfig;
  code?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request?: any;
  response?: Response<T>;
  isAxiosError: boolean;
  toJSON: () => Record<string, unknown>;
}

const cleanHeaders = (headers: Record<string, unknown>) =>
  headers &&
  'Authorization' in headers &&
  typeof headers.Authorization === 'string'
    ? {
        ...headers,
        Authorization: `Bearer ${`...${headers.Authorization.substr(-5)}`}`,
      }
    : headers;

export class ApiError extends Error {
  public qName: string;

  public readonly error?: string;

  public readonly message: string;

  public readonly status?: number;

  public readonly statusText?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly request?: Record<string, any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly response?: Record<string, any>;

  constructor(error: HttpError) {
    const { config, response } = error;
    const message = response?.data?.description || response?.data?.message;
    super(message);
    this.qName = response?.data?.name;
    this.status = response?.status;
    this.statusText = response?.statusText;
    this.error = response?.data?.error || response?.data?.name;
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

export class ServerError extends ApiError {}

export class ResourceUnknownError extends ApiError {}
export class ResourceAlreadyExistsError extends ApiError {}

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
export class IllegalArgumentError extends ApiError {}
export class IllegalStateError extends ApiError {}
export class MissingRequiredFieldsError extends ApiError {}
export class PasswordError extends ApiError {}
export class EmailUsedError extends ApiError {}
export class EmailUnknownError extends ApiError {}
export class AlreadyActivatedError extends ApiError {}
export class ActivationUnknownError extends ApiError {}
export class InvalidTokenError extends ApiError {}
export class UnauthorizedTokenError extends ApiError {}
export class TokenNotDeleteableError extends ApiError {}
export class FileTooLargeError extends ApiError {}
export class InvalidGrantError extends ApiError {}
export class MfaRequiredError extends ApiError {}
export class StatusInUseError extends ApiError {}
export class MfaReattemptDelayError extends ApiError {}
export class LockedDocumentError extends ApiError {}
export class OauthTokenError extends ApiError {}
export class OauthKeyError extends ApiError {}
export class LocalizationKeyMissingError extends ApiError {}
export class TemplateFillingError extends ApiError {}
