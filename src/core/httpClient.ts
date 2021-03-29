import axios from 'axios';
import { HttpConfig } from './types';

export default class HttpClient {
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  get(config: HttpConfig) {
    return axios.get(`${this.path}/${config.path}`, {
      params: config.query,
    }).then(res => res.data).catch(e => {
      throw new Error(e);
    });
  }

  post(config: HttpConfig) {
    return axios.post(`${this.path}/${config.path}`, config.body)
      .then(res => res.data).catch(e => {
        throw new Error(e);
      });
  }

  put(config: HttpConfig) {
    return axios.put(`${this.path}/${config.path}`, config.body)
      .then(res => res.data).catch(e => {
        throw new Error(e);
      });
  }
}
