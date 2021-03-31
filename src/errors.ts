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
