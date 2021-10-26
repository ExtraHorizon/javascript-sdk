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
        Authorization: `${
          headers.Authorization.startsWith('Bearer')
            ? ''
            : headers.Authorization.substr(0, 75)
        } ... ${headers.Authorization.substr(-20)}}`,
      }
    : headers;

export class ApiError extends Error {
  constructor(
    message: string,
    public qName?: string,
    public status?: number,
    public statusText?: string,
    public error?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public request?: Record<string, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public response?: Record<string, any>
  ) {
    super(message);
  }

  public static createFromHttpError(error: HttpError): ApiError {
    const { config, response } = error;

    if (!error.response) {
      // Something went wrong before the request. Return the error
      return error;
    }
    return new this(
      response?.data?.description ||
        response?.data?.message ||
        'Received an error without a message',
      response?.data?.name || response?.data?.error,
      response?.status,
      response?.statusText,
      response?.data?.error || response?.data?.name,
      config
        ? {
            url: config.url,
            headers: cleanHeaders(config.headers), // Obscure the Authorization token
            method: config.method,
            payloadData: config.data,
          }
        : {},
      {
        ...response?.data,
      }
    );
  }
}

// HTTP status code error

// 400 Bad Request
export class BadRequestError extends ApiError {}
export class ResourceAlreadyExistsError extends BadRequestError {}
export class IllegalArgumentError extends BadRequestError {}
export class ApplicationUnknownError extends BadRequestError {}
export class CallbackNotValidError extends BadRequestError {}
export class UnsupportedResponseTypeError extends BadRequestError {}
export class InvalidRequestError extends BadRequestError {}
export class InvalidGrantError extends BadRequestError {}
export class UnsupportedGrantTypeError extends BadRequestError {}
export class MfaRequiredError extends BadRequestError {}

export class InvalidMfaCodeError extends BadRequestError {}
export class InvalidMfaTokenError extends BadRequestError {}
export class MfaReattemptDelayError extends BadRequestError {}

export class NotEnoughMfaMethodsError extends BadRequestError {}
export class InvalidPresenceTokenError extends BadRequestError {}

export class EmailUsedError extends BadRequestError {}
export class PasswordError extends BadRequestError {}
export class AlreadyActivatedError extends BadRequestError {}
export class EmailUnknownError extends BadRequestError {}
export class ActivationUnknownError extends BadRequestError {}
export class NotActivatedError extends BadRequestError {}
export class EmptyBodyError extends BadRequestError {}

export class NewPasswordHashUnknownError extends BadRequestError {}
export class IllegalStateError extends BadRequestError {}
export class StatusInUseError extends BadRequestError {}
export class LockedDocumentError extends BadRequestError {}
export class FileTooLargeError extends BadRequestError {}
export class InvalidTokenError extends BadRequestError {}
export class LocalizationKeyMissingError extends BadRequestError {}
export class TemplateFillingError extends BadRequestError {}
export class MissingRequiredFieldsError extends BadRequestError {}
export class InvalidCurrencyForProductPrice extends BadRequestError {}
export class InvalidReceiptDataError extends BadRequestError {}
export class UnknownReceiptTransactionError extends BadRequestError {}
export class AppStoreTransactionAlreadyLinked extends BadRequestError {}
export class NoMatchingPlayStoreLinkedSubscription extends BadRequestError {}
export class PlayStoreTransactionAlreadyLinked extends BadRequestError {}
export class NoConfiguredPlayStoreProduct extends BadRequestError {}
export class StripePaymentMethodError extends BadRequestError {}
export class DefaultLocalizationMissingError extends BadRequestError {}

export class IDFormatError extends BadRequestError {}
export class ProfileAlreadyExistsError extends BadRequestError {}

// 401 Unauthorized
export class UnauthorizedError extends ApiError {}
export class InvalidClientError extends UnauthorizedError {}
export class ApplicationNotAuthenticatedError extends UnauthorizedError {}
export class AuthenticationError extends UnauthorizedError {}
export class LoginTimeoutError extends UnauthorizedError {}
export class LoginFreezeError extends UnauthorizedError {}
export class TooManyFailedAttemptsError extends UnauthorizedError {}

export class OauthKeyError extends UnauthorizedError {}
export class OauthTokenError extends UnauthorizedError {}
export class OauthSignatureError extends UnauthorizedError {}
export class DuplicateRequestError extends UnauthorizedError {}
export class AccessTokenUnknownError extends UnauthorizedError {}
export class AccessTokenExpiredError extends UnauthorizedError {}

export class NoPermissionError extends UnauthorizedError {}
export class UnauthorizedTokenError extends UnauthorizedError {}

export class UserNotAuthenticatedError extends UnauthorizedError {
  constructor(error: HttpError) {
    const { config } = error;
    super(`

Looks like you forgot to authenticate. Please check the README file to get started.  
As example if you want to use the Oauth2 Password Grant Flow you can authenticate using this snippet:

const sdk = createClient({
  host: '${config ? config.baseURL : ''}',
  clientId: '',
});

await sdk.auth.authenticate({
  username: '',
  password: '',
});  
    
`);
  }
}

// 403 Forbidden
export class ForbiddenError extends ApiError {}
export class TokenNotDeleteableError extends ForbiddenError {}
export class RemoveFieldError extends ForbiddenError {}

// 404 Not Found
export class NotFoundError extends ApiError {}
export class ResourceUnknownError extends NotFoundError {}
export class NoConfiguredAppStoreProduct extends NotFoundError {}

// 500 Server Error
export class ServerError extends ApiError {}
export class FieldFormatError extends ServerError {}

// 502 Bad Gateway Server Error
export class BadGatewayServerError extends ApiError {}
export class StripeRequestError extends BadGatewayServerError {}
