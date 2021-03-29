import { AxiosError } from 'axios';

const cleanHeaders = (headers: Record<string, any>) =>
  headers && headers.Authorization
    ? {
        ...headers,
        Authorization: `Bearer ${`...${headers.Authorization.substr(-5)}`}`,
      }
    : headers;

export class ApiError {
  public qName: string;

  public readonly status?: number;

  public readonly statusText?: string;

  public readonly request?: Record<string, any>;

  public readonly response?: Record<string, any>;

  constructor(error: AxiosError) {
    const { config, response } = error;
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
  constructor(error: AxiosError) {
    super(error);
    this.qName = 'RESOURCE_UNKNOWN_EXCEPTION';
  }
}
