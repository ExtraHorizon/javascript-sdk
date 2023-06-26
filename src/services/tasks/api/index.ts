import { ApiService } from './types';
import { HttpInstance } from '../../../http/types';
import { HttpClient } from '../../http-client';
import { OptionsBase } from '../../types';

export default (client: HttpClient, httpAuth: HttpInstance): ApiService => ({
  async get<T>(name: string, path: string, options: OptionsBase): Promise<T> {
    const { data } = await client.get(
      httpAuth,
      `/api/${name}/${path}`,
      options
    );
    return data;
  },

  async post<T, U>(
    name: string,
    path: string,
    data: U,
    options: OptionsBase
  ): Promise<T> {
    const response = await client.post(
      httpAuth,
      `/api/${name}/${path}`,
      data,
      options
    );

    return response.data;
  },

  async put<T, U>(
    name: string,
    path: string,
    data: U,
    options: OptionsBase
  ): Promise<T> {
    const response = await client.put(
      httpAuth,
      `/api/${name}/${path}`,
      data,
      options
    );

    return response.data;
  },
});
