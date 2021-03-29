import axios from 'axios';
import { HttpConfig } from './types';

export default class HttpClient {
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  get(config: HttpConfig): Record<string, any> {
    return this.makeRequest({ ...config, method: 'GET' });
  }

  post(config: HttpConfig): Record<string, any> {
    return this.makeRequest({ ...config, method: 'POST' });
  }

  put(config: HttpConfig): Record<string, any> {
    return this.makeRequest({ ...config, method: 'PUT' });
  }

  delete(config: HttpConfig): Record<string, any> {
    return this.makeRequest({ ...config, method: 'DELETE' });
  }

  private makeRequest(config: HttpConfig): Record<string, any> {
    if (config.skipAuthentication) {
      // TODO: skip authentication
    }
    if (config.decamelizeRequest) {
      // TODO: decamelize request
    }
    const url = `${this.path}/${config.path}`;
    const params = config.query;
    const data = config.body;

    return axios({ url, params, data })
      .then(res => res.data)
      .catch(e => {
        throw new Error(e);
      });
  }
}
