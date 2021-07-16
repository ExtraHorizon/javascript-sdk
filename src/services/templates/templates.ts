import type { HttpInstance } from '../../types';
import {
  AffectedRecords,
  ObjectId,
  PagedResult,
  ResultResponse,
  Results,
} from '../types';
import { RQLString, rqlBuilder } from '../../rql';
import type {
  TemplateIn,
  TemplateOut,
  CreateFile,
  TemplatesService,
} from './types';

export default (client, httpAuth: HttpInstance): TemplatesService => ({
  async health(): Promise<boolean> {
    const result: ResultResponse = await client.get(httpAuth, '/health');
    return result.status === Results.Success;
  },

  async find(options?: { rql?: RQLString }): Promise<PagedResult<TemplateOut>> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  async findById(
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<TemplateOut> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  async findByName(
    name: string,
    options?: { rql?: RQLString }
  ): Promise<TemplateOut> {
    const rqlWithName = rqlBuilder(options?.rql).eq('name', name).build();
    const res = await this.find({ rql: rqlWithName });
    return res.data[0];
  },

  async findFirst(options?: { rql?: RQLString }): Promise<TemplateOut> {
    const res = await this.find(options);
    return res.data[0];
  },

  async create(requestBody: TemplateIn): Promise<TemplateOut> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },

  async update(
    templateId: string,
    requestBody: TemplateIn
  ): Promise<TemplateOut> {
    return (await client.put(httpAuth, `/${templateId}`, requestBody)).data;
  },

  async remove(templateId: string): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/${templateId}`)).data;
  },

  async resolveAsPdf(
    templateId: string,
    requestBody: CreateFile
  ): Promise<Buffer> {
    return (
      await client.post(httpAuth, `/${templateId}/pdf`, requestBody, {
        responseType: 'arraybuffer',
      })
    ).data;
  },

  async resolveAsPdfUsingCode(
    templateId: string,
    localizationCode: string,
    requestBody: CreateFile
  ): Promise<Buffer> {
    return (
      await client.post(
        httpAuth,
        `/${templateId}/pdf/${localizationCode}`,
        requestBody,
        {
          responseType: 'arraybuffer',
        }
      )
    ).data;
  },

  async resolveAsJson(
    templateId: string,
    requestBody: CreateFile
  ): Promise<Record<string, string>> {
    return (await client.post(httpAuth, `/${templateId}/resolve`, requestBody))
      .data;
  },

  async resolveAsJsonUsingCode(
    templateId: string,
    localizationCode: string,
    requestBody: CreateFile
  ): Promise<Record<string, string>> {
    return (
      await client.post(
        httpAuth,
        `/${templateId}/resolve/${localizationCode}`,
        requestBody
      )
    ).data;
  },
});
