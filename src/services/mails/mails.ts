import type { HttpInstance } from '../../types';
import {
  AffectedRecords,
  PagedResult,
  ResultResponse,
  Results,
  ObjectId,
} from '../types';
import { RQLString, rqlBuilder } from '../../rql';
import {
  Mail,
  QueuedMail,
  PlainMailCreation,
  TemplateBasedMailCreation,
  MailsService,
} from './types';

export default (client, httpAuth: HttpInstance): MailsService => ({
  async health(): Promise<boolean> {
    const result: ResultResponse = await client.get(httpAuth, '/health');
    return result.status === Results.Success;
  },

  async find(options?: { rql?: RQLString }): Promise<PagedResult<Mail>> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  async findById(id: ObjectId, options?: { rql?: RQLString }): Promise<Mail> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  async findFirst(options?: { rql?: RQLString }): Promise<Mail> {
    const res = await this.find(options);
    return res.data[0];
  },

  async send(
    requestBody?: PlainMailCreation | TemplateBasedMailCreation
  ): Promise<Mail> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },

  async track(trackingHash: string): Promise<AffectedRecords> {
    return (await client.get(httpAuth, `/${trackingHash}/open`)).data;
  },

  async findOutbound(options?: {
    rql?: string;
  }): Promise<PagedResult<QueuedMail>> {
    return (await client.get(httpAuth, `/queued${options?.rql || ''}`)).data;
  },
});
