import { decamelizeKeys } from 'humps';
import { apiRequest } from './request';
import { ApiClientOptions, ApiRequestOptions } from './models';

export class ApiClient {
  constructor(private serviceName: string, private serviceVersion: string, private options: ApiClientOptions = {}) {
    const defaultOptions = {
      host: process.env.API_HOST,
      oauthConsumer: {
        key: process.env.API_OAUTH_CONSUMER_KEY,
        secret: process.env.API_OAUTH_CONSUMER_SECRET,
      },
      oauthToken: {
        key: process.env.API_OAUTH_TOKEN,
        secret: process.env.API_OAUTH_TOKEN_SECRET,
      },
    };

    this.options = { ...defaultOptions, ...options };
  }

  withOptions(options: ApiClientOptions) {
    return new ApiClient(this.serviceName, this.serviceVersion, {
      ...this.options,
      ...options,
    });
  }

  async post(path: string, data?: any) {
    return await this.request('POST', path, data);
  }

  async get(path: string) {
    return await this.request('GET', path);
  }

  async put(path: string, data?: any) {
    return await this.request('PUT', path, data);
  }

  async delete(path: string, data?: any) {
    return await this.request('DELETE', path, data);
  }

  async count(path: string) {
    const fullPath = addQueryPart(path, 'select(id)&limit(1)');

    const response = await this.request('GET', fullPath);
    if (!isPagedResponse(response)) {
      throw new Error('Did not receive a list response!');
    }

    return response.page.total as number;
  }

  async first(path: string) {
    const fullPath = addQueryPart(path, 'limit(1)');

    const response = await this.request('GET', fullPath);
    if (!isPagedResponse(response)) {
      throw new Error('Did not receive a list response!');
    }

    return response.data[0];
  }

  async list(path: string, pageSize = 50, skip = 0) {
    const items = [];
    let total = 0;
    let nextSkip = skip;

    do {
      const fullPath = addQueryPart(path, `limit(${pageSize},${nextSkip})`);
      const response = await this.get(fullPath);

      if (!isPagedResponse(response)) {
        throw new Error('Did not receive a list response!');
      }

      total = response.page.total;
      nextSkip += response.data.length;

      items.push(...response.data);
    } while (nextSkip < total);

    return items;
  }

  async request(method: ApiRequestOptions['method'], path: string, data?: any) {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    const { host, ...extraRequestOptions } = this.options;

    return await apiRequest({
      ...extraRequestOptions,
      method,
      data: decamelizeKeys(data),
      url: `https://api.${host}/${this.serviceName}/${this.serviceVersion}/${normalizedPath}`,
    });
  }
}

function addQueryPart(url: string, queryPart: string) {
  const joiner = url.includes('?') ? '&' : '?';
  return `${url}${joiner}${queryPart}`;
}

function isPagedResponse(response: any): response is PagedResponse {
  return !!(response.page && typeof response.page.total === 'number' && response.data instanceof Array);
}

interface PagedResponse {
  page: {
    total: number;
    offset: number;
    limit: number;
  };
  data: any[];
}
