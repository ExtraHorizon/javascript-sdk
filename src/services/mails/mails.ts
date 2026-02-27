import { rqlBuilder } from '../../rql';
import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import { ResultResponse, Results } from '../types';
import { MailsService } from './types';

export default (client: HttpClient, httpAuth: HttpInstance): MailsService => ({
  async health(): Promise<boolean> {
    const result: ResultResponse = await client.get(httpAuth, '/health');
    return result.status === Results.Success;
  },

  async find(options) {
    const result = await client.get(
      httpAuth,
      `/${options?.rql || ''}`,
      {
        ...options,
        customResponseKeys: ['data.content'],
      }
    );

    return result.data;
  },

  async findById(this: MailsService, id, options) {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    return await this.findFirst({ ...options, rql: rqlWithId });
  },

  async findFirst(this: MailsService, options) {
    const res = await this.find(options);
    return res.data[0];
  },

  async send(requestBody, options) {
    const result = await client.post(
      httpAuth,
      '/',
      requestBody,
      {
        ...options,
        customKeys: ['content'],
      }
    );

    return result.data;
  },

  async track(trackingHash, options) {
    const result = await client.get(
      httpAuth,
      `/${trackingHash}/open`,
      options
    );

    return result.data;
  },

  async findOutbound(options) {
    const result = await client.get(
      httpAuth,
      `/queued${options?.rql || ''}`,
      {
        ...options,
        customResponseKeys: ['data.templateData.content'],
      }
    );

    return result.data;
  },
});
