import { ApiService } from './types';
import { HttpInstance } from '../../../http/types';
import { HttpClient } from '../../http-client';
import { OptionsBase } from '../../types';

export default (client: HttpClient, httpAuth: HttpInstance): ApiService => {
  function normalizePath(path: string) {
    return path.startsWith('/') ? path : `/${path}`;
  }

  return {
    async get<T>(
      functionName: string,
      path: string,
      options: OptionsBase
    ): Promise<T> {
      const { data } = await client.get(
        httpAuth,
        `/api/${functionName}${normalizePath(path)}`,
        { ...options, customKeys: ['*'] }
      );
      return data;
    },

    async post<T, U>(
      functionName: string,
      path: string,
      data: U,
      options: OptionsBase
    ): Promise<T> {
      const response = await client.post(
        httpAuth,
        `/api/${functionName}${normalizePath(path)}`,
        data,
        { ...options, customKeys: ['*'] }
      );

      return response.data;
    },

    async put<T, U>(
      functionName: string,
      path: string,
      data: U,
      options: OptionsBase
    ): Promise<T> {
      const response = await client.put(
        httpAuth,
        `/api/${functionName}${normalizePath(path)}`,
        data,
        { ...options, customKeys: ['*'] }
      );

      return response.data;
    },

    async delete<T>(
      functionName: string,
      path: string,
      options: OptionsBase
    ): Promise<T> {
      const { data } = await client.delete(
        httpAuth,
        `/api/${functionName}${normalizePath(path)}`,
        { ...options, customKeys: ['*'] }
      );
      return data;
    },

    async patch<T, U>(
      functionName: string,
      path: string,
      data: U,
      options: OptionsBase
    ): Promise<T> {
      const response = await client.patch(
        httpAuth,
        `/api/${functionName}${normalizePath(path)}`,
        data,
        { ...options, customKeys: ['*'] }
      );

      return response.data;
    },
  };
};
