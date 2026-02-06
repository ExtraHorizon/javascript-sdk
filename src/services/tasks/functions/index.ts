import { HttpInstance } from '../../../http/types';
import { HttpClient } from '../../http-client';
import { FunctionsService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): FunctionsService => ({
  async find(options) {
    const response = await client.get(httpAuth, '/functions/', options);
    return response.data;
  },

  async create(body, options) {
    const response = await client.post(httpAuth, '/functions/', body, {
      ...options,
      customKeys: ['environmentVariables'],
    });
    return response.data;
  },

  async getByName(name, options) {
    const response = await client.get(httpAuth, `/functions/${name}`, {
      ...options,
      customResponseKeys: ['environmentVariables'],
    });
    return response.data;
  },

  async update(name, body, options) {
    const response = await client.put(httpAuth, `/functions/${name}`, body, {
      ...options,
      customRequestKeys: ['environmentVariables'],
    });
    return response.data;
  },

  async delete(name, options) {
    const response = await client.delete(httpAuth, `/functions/${name}`, options);
    return response.data;
  },

  async enable(name, options) {
    const response = await client.post(httpAuth, `/functions/${name}/enable`, {}, options);
    return response.data;
  },

  async disable(name, options) {
    const response = await client.post(httpAuth, `/functions/${name}/disable`, {}, options);
    return response.data;
  },

  async execute(functionName, data, options) {
    const response = await client.post(httpAuth, `/functions/${functionName}/execute`, { data }, {
      ...options,
      customKeys: ['data', 'result'],
    });
    return response.data;
  },
});
