import type { HttpInstance } from '../../types';
import { AffectedRecords, PagedResult } from '../types';
import { RQLString, rqlBuilder } from '../../rql';
import type {
  Localization,
  BulkLocalization,
  BulkCreationResponse,
  BulkUpdateResponse,
  LocalizationRequest,
  MappedText,
  LocalizationsService,
} from './types';

export default (client, httpAuth: HttpInstance): LocalizationsService => ({
  async find(options?: {
    rql?: RQLString;
  }): Promise<PagedResult<Localization>> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  async findByKey(
    key: string,
    options?: { rql?: RQLString }
  ): Promise<Localization> {
    const rqlWithKey = rqlBuilder(options?.rql).eq('key', key).build();
    const res = await this.find({ rql: rqlWithKey });
    return res.data[0];
  },

  async findFirst(options?: { rql?: RQLString }): Promise<Localization> {
    const res = await this.find(options);
    return res.data[0];
  },

  async create(requestBody: BulkLocalization): Promise<BulkCreationResponse> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },

  async update(requestBody: BulkLocalization): Promise<BulkUpdateResponse> {
    return (await client.put(httpAuth, '/', requestBody)).data;
  },

  async remove(rql: RQLString): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/${rql || ''}`)).data;
  },

  async getByKeys(
    requestBody: LocalizationRequest
  ): Promise<Record<string, MappedText>> {
    return (await client.post(httpAuth, '/request', requestBody)).data;
  },
});
