import { AxiosError } from 'axios';

const cleanHeaders = (headers: Record<string, any>) =>
  headers && headers.Authorization
    ? {
        ...headers,
        Authorization: `Bearer ${`...${headers.Authorization.substr(-5)}`}`,
      }
    : headers;

export class ApiError {
  public readonly qName: string;

  public readonly status?: number;

  public readonly statusText?: string;

  public readonly request?: Record<string, any>;

  public readonly response?: Record<string, any>;

  constructor(error: AxiosError) {
    const { config, response } = error;
    console.log('response', response?.data);
    this.status = response?.status;
    this.statusText = response?.statusText;
    this.response = response?.data;
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

export class ResourceUnknownError extends ApiError {
  static qName = 'RESOURCE_UNKNOWN_EXCEPTION';
}

export class MissingRequiredFieldsError extends ApiError {
  static qName = 'MISSING_REQUIRED_FIELDS_EXCEPTION';

  // TODO handle missing fields
}

export class AuthenticationError extends ApiError {
  static qName = 'AUTHENTICATION_EXCEPTION';
}

export class ResourceAlreadyExistsError extends ApiError {
  static qName = 'RESOURCE_ALREADY_EXISTS_EXCEPTION';
}
