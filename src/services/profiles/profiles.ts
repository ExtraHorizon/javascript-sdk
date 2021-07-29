import type { HttpInstance } from '../../types';
import { AffectedRecords, PagedResult, ObjectId } from '../types';
import { RQLString, rqlBuilder } from '../../rql';
import {
  Profile,
  ProfileCreation,
  Comorbidities,
  Impediments,
  ProfilesService,
} from './types';

export default (client, httpAuth: HttpInstance): ProfilesService => ({
  async find(options?: { rql?: RQLString }): Promise<PagedResult<Profile>> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  async findById(
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Profile> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  async findFirst(options?: { rql?: RQLString }): Promise<Profile> {
    const res = await this.find(options);
    return res.data[0];
  },

  async create(requestBody: ProfileCreation): Promise<Profile> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },

  async update(rql: RQLString, requestBody: Profile): Promise<AffectedRecords> {
    return (await client.put(httpAuth, `/${rql}`, requestBody)).data;
  },

  async removeFields(
    rql: RQLString,
    requestBody: {
      fields: Array<string>;
    }
  ): Promise<AffectedRecords> {
    return (await client.post(httpAuth, `/remove_fields${rql}`, requestBody))
      .data;
  },

  async getComorbidities(): Promise<PagedResult<Comorbidities>> {
    return (await client.get(httpAuth, '/comorbidities')).data;
  },

  async getImpediments(): Promise<PagedResult<Impediments>> {
    return (await client.get(httpAuth, '/impediments')).data;
  },
});
