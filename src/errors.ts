import { MfaMethod, NotificationV2Error } from './types';

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
  type: 'proxy' | 'oauth1' | 'oauth2';
  toJSON: () => Record<string, unknown>;
}

const cleanHeaders = (headers: Record<string, unknown>) => (headers &&
  'Authorization' in headers &&
  typeof headers.Authorization === 'string' ?
  {
    ...headers,
    Authorization: `${
      headers.Authorization.startsWith('Bearer') ?
        '' :
        headers.Authorization.substring(0, 75)
    } ... ${headers.Authorization.substring(-20)}}`,
  } :
  headers);

const getHttpErrorName = (error: HttpError) => (
  error?.response?.data?.name ||
  error?.response?.data?.error ||
  error?.name ||
  'API_ERROR'
);

const getHttpErrorMessage = (error: HttpError) => (
  error?.response?.data?.description ||
  error?.response?.data?.message ||
  error?.message ||
  'Received an error without a message'
);

const getHttpErrorRequestData = (error: HttpError) => (error?.config ?
  {
    url: error.config.url,
    headers: cleanHeaders(error.config.headers), // Obscure the Authorization token
    method: error.config.method,
    payloadData: error.config.data,
  } :
  {});

export class ApiError extends Error {
  public qName?: string;

  public name: string;

  public status?: number;

  public statusText?: string;

  public error?: string;

  public request?: Record<string, any>;

  public response?: Record<string, any>;

  constructor(data: ApiError) {
    super(data.message);
    this.name = data.name;
    this.status = data.status;
    this.statusText = data.statusText;
    this.error = data.error;
    this.request = data.request;
    this.response = data.response;
    this.qName = data.name;
  }

  public static createFromHttpError(error: HttpError): ApiError {
    const { response } = error;

    if (!error.response) {
      // Something went wrong before the request. Return the error
      return error;
    }

    const apiError: ApiError = {
      message: getHttpErrorMessage(error),
      name: getHttpErrorName(error),
      status: response?.status,
      statusText: response?.statusText,
      error: response?.data?.error || getHttpErrorName(error),
      request: getHttpErrorRequestData(error),
      response: {
        ...response?.data,
      },
    };

    return new this(apiError);
  }
}

export class OAuth2LoginError extends ApiError {
  public exhError: ApiError;

  constructor(apiError: ApiError) {
    super(apiError);

    const exhErrorData = apiError?.response?.exh_error;
    if (!exhErrorData) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const ExhErrorClass = ErrorClassMap[exhErrorData.code] || ApiError;

    this.exhError = new ExhErrorClass({
      message: exhErrorData.description,
      name: exhErrorData.name,
      status: apiError.status,
      statusText: apiError.statusText,
      error: exhErrorData.name,
      request: apiError.request,
      response: exhErrorData,
    });
  }

  public static createFromHttpError(error: HttpError): OAuth2LoginError {
    return new this(ApiError.createFromHttpError(error));
  }
}

// HTTP status code error

// 400 Bad Request
export class BodyFormatError extends ApiError {}
export class BadRequestError extends ApiError {}
export class ResourceAlreadyExistsError extends BadRequestError {}
export class IllegalArgumentError extends BadRequestError {}
export class ApplicationUnknownError extends BadRequestError {}
export class CallbackNotValidError extends BadRequestError {}
export class UnsupportedResponseTypeError extends BadRequestError {}
export class UnsupportedGrantError extends BadRequestError {}
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
export class NewPasswordPinCodeUnknownError extends BadRequestError {}
export class IncorrectPinCodeError extends BadRequestError {}
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

export class OAuth2MissingClientCredentialsError extends BadRequestError {}
export class InvalidNonceError extends BadRequestError {}
export class OidcProviderResponseError extends BadRequestError {}
export class OidcInvalidAuthorizationCodeError extends BadRequestError {}
export class InvalidPKCEError extends BadRequestError {}
export class AuthorizationUnknownError extends BadRequestError {}
export class AuthorizationCodeExpiredError extends BadRequestError {}
export class MissingPKCEVerifierError extends BadRequestError {}
export class RefreshTokenUnknownError extends BadRequestError {}
export class RefreshTokenExpiredError extends BadRequestError {}

export class FirebaseInvalidPlatformDataError extends BadRequestError {
  notificationId?: string;

  errors?: NotificationV2Error[];

  constructor(apiError: ApiError) {
    super(apiError);
    this.notificationId = apiError.response.notificationId;
    this.errors = apiError.response.errors;
  }
}

// 401 Unauthorized
export class UnauthorizedError extends ApiError {}
export class ApplicationNotAuthenticatedError extends UnauthorizedError {}
export class AuthenticationError extends UnauthorizedError {}
export class LoginTimeoutError extends UnauthorizedError {}
export class LoginFreezeError extends UnauthorizedError {}
export class TooManyFailedAttemptsError extends UnauthorizedError {}

export class OauthKeyError extends UnauthorizedError {}
export class OauthSignatureError extends UnauthorizedError {}
export class DuplicateRequestError extends UnauthorizedError {}
export class AccessTokenUnknownError extends UnauthorizedError {}
export class AccessTokenExpiredError extends UnauthorizedError {}

export class NoPermissionError extends UnauthorizedError {}
export class UnauthorizedTokenError extends UnauthorizedError {}

export class OAuth2ClientIdError extends UnauthorizedError {}
export class OAuth2ClientSecretError extends UnauthorizedError {}

export class UserNotAuthenticatedError extends UnauthorizedError {
  public static createFromHttpError(error: HttpError): ApiError {
    return new this({
      message: getSpecifiedAuthenticationError(error),
      name: getHttpErrorName(error),
    });
  }
}

export class OauthTokenError extends UnauthorizedError {
  public static createFromHttpError(error: HttpError): ApiError {
    return new this({
      message: getSpecifiedAuthenticationError(error),
      name: getHttpErrorName(error),
    });
  }
}

// 403 Forbidden
export class ForbiddenError extends ApiError {}
export class TokenNotDeleteableError extends ForbiddenError {}
export class RemoveFieldError extends ForbiddenError {}
export class DisabledForOidcUsersError extends ForbiddenError {}
export class NewMFARequiredError extends ForbiddenError {}
export class PinCodesNotEnabledError extends ForbiddenError {}
export class ForgotPasswordRequestLimitError extends ForbiddenError {}
export class ForgotPasswordRequestTimeoutError extends ForbiddenError {}
export class ActivationRequestLimitError extends ForbiddenError {}
export class ActivationRequestTimeoutError extends ForbiddenError {}

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

export class FirebaseConnectionError extends BadGatewayServerError {
  notificationId?: string;

  errors?: NotificationV2Error[];

  constructor(apiError: ApiError) {
    super(apiError);
    this.notificationId = apiError.response.notificationId;
    this.errors = apiError.response.errors;
  }
}

// 503 Service Unavailable Error
export class ServiceUnavailableError extends ApiError {}
export class OidcIdTokenError extends ServiceUnavailableError {}

// OAuth2Login Errors
export class InvalidGrantError extends OAuth2LoginError {}
export class InvalidClientError extends OAuth2LoginError {}
export class InvalidRequestError extends OAuth2LoginError {}
export class UnauthorizedClientError extends OAuth2LoginError {}
export class UnsupportedGrantTypeError extends OAuth2LoginError {}
export class MfaRequiredError extends OAuth2LoginError {
  mfa: {
    token: string;
    tokenExpiresIn: number;
    methods: Array<Pick<MfaMethod, 'id' | 'type' | 'name' | 'tags'>>;
  };

  constructor(apiError: ApiError) {
    super(apiError);
    this.mfa = apiError.response.mfa;
  }
}

function getSpecifiedAuthenticationError(error: HttpError): string {
  const { type, config } = error;

  const messageHeader =
    'Looks like you are not authenticated yet. Please check the README file to get started.  ';

  switch (type) {
    case 'proxy': {
      return `${messageHeader}
      As example you can authenticate using this snippet:
      
      try {
        const exh = createProxyClient({
          host: '${config ? config.baseURL : ''}',
        });

        exh.users.me(); 
      
      } catch (error) {
        // redirect to login page of your proxy service
      }
      `;
    }
    case 'oauth1': {
      return `${messageHeader}
      As example if you want to use the Oauth1 you can authenticate using this snippet:
      
      const exh = createClient({
        host: '${config ? config.baseURL : ''}',
        consumerKey: '',
        consumerSecret: '',
      });
      
      await exh.auth.authenticate({
        email: '',
        password: '',
      });  
          
      `;
    }
    case 'oauth2': {
      return `${messageHeader}
      As example if you want to use the Oauth2 Password Grant Flow you can authenticate using this snippet:
      
      const exh = createClient({
        host: '${config ? config.baseURL : ''}',
        clientId: '',
      });
      
      await exh.auth.authenticate({
        username: '',
        password: '',
      });  
          
      `;
    }
    default: {
      return messageHeader;
    }
  }
}

export const OAuth2ErrorClassMap = {
  invalid_grant: InvalidGrantError,
  invalid_client: InvalidClientError,
  invalid_request: InvalidRequestError,
  unauthorized_client: UnauthorizedClientError,
  unsupported_grant_type: UnsupportedGrantTypeError,
  mfa_required: MfaRequiredError,
};

export const ErrorClassMap = {
  1: ServerError,
  10: NoPermissionError,
  11: RemoveFieldError,
  12: IDFormatError,
  13: EmptyBodyError,
  14: MissingRequiredFieldsError,
  15: FieldFormatError,
  16: ResourceUnknownError,
  17: ResourceAlreadyExistsError,
  22: BodyFormatError,
  26: IllegalArgumentError,
  27: IllegalStateError,
  101: ApplicationNotAuthenticatedError,
  103: ApplicationUnknownError,
  104: UserNotAuthenticatedError,
  106: AuthenticationError,
  107: OauthKeyError,
  108: OauthTokenError,
  109: OauthSignatureError,
  110: DuplicateRequestError,
  113: CallbackNotValidError,
  114: UnsupportedResponseTypeError,
  115: AuthorizationUnknownError,
  116: AuthorizationCodeExpiredError,
  117: AccessTokenUnknownError,
  118: AccessTokenExpiredError,
  119: RefreshTokenUnknownError,
  120: RefreshTokenExpiredError,
  121: UnsupportedGrantError,
  122: InvalidPKCEError,
  123: OAuth2ClientIdError,
  124: OAuth2ClientSecretError,
  126: OAuth2MissingClientCredentialsError,
  128: MissingPKCEVerifierError,
  129: MfaRequiredError,
  130: InvalidMfaCodeError,
  131: InvalidMfaTokenError,
  132: InvalidPresenceTokenError,
  133: NotEnoughMfaMethodsError,
  134: MfaReattemptDelayError,
  136: OidcIdTokenError,
  137: InvalidNonceError,
  138: OidcProviderResponseError,
  139: OidcInvalidAuthorizationCodeError,
  202: EmailUnknownError,
  203: EmailUsedError,
  204: NotActivatedError,
  205: ActivationUnknownError,
  206: AlreadyActivatedError,
  207: NewPasswordHashUnknownError,
  208: PasswordError,
  211: LoginTimeoutError,
  212: LoginFreezeError,
  213: TooManyFailedAttemptsError,
  215: DisabledForOidcUsersError,
  218: PinCodesNotEnabledError,
  219: NewPasswordPinCodeUnknownError,
  220: ForgotPasswordRequestLimitError,
  221: ForgotPasswordRequestTimeoutError,
  222: ActivationRequestLimitError,
  223: ActivationRequestTimeoutError,
  224: IncorrectPinCodeError,
  301: ProfileAlreadyExistsError,
  414: StatusInUseError,
  415: LockedDocumentError,
  801: DefaultLocalizationMissingError,
  1002: LocalizationKeyMissingError,
  1003: TemplateFillingError,
  2605: InvalidTokenError,
  2606: UnauthorizedTokenError,
  2607: TokenNotDeleteableError,
  2610: FileTooLargeError,
  2707: InvalidReceiptDataError,
  2708: UnknownReceiptTransactionError,
  2712: StripeRequestError,
  2713: StripePaymentMethodError,
  2714: InvalidCurrencyForProductPrice,
  2716: NoConfiguredAppStoreProduct,
  2717: AppStoreTransactionAlreadyLinked,
  2718: NoMatchingPlayStoreLinkedSubscription,
  2719: NoConfiguredPlayStoreProduct,
  2720: PlayStoreTransactionAlreadyLinked,
};
