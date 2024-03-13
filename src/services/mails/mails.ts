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
    return (
      await client.get(httpAuth, `/${options?.rql || ''}`, {
        ...options,
        customResponseKeys: ['data.content'],
      })
    ).data;
  },

  async findById(this: MailsService, id, options) {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ ...options, rql: rqlWithId });
    return res.data[0];
  },

  async findFirst(this: MailsService, options) {
    const res = await this.find(options);
    return res.data[0];
  },

  async send(requestBody, options) {
    return (
      await client.post(httpAuth, '/', requestBody, {
        ...options,
        customKeys: ['content'],
      })
    ).data;
  },

  async track(trackingHash, options) {
    return (await client.get(httpAuth, `/${trackingHash}/open`, options)).data;
  },

  async findOutbound(options) {
    return (
      await client.get(httpAuth, `/queued${options?.rql || ''}`, {
        ...options,
        customResponseKeys: ['data.templateData.content'],
      })
    ).data;
  },
});
