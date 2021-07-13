import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords, PagedResult } from '../types';
import type {
  DataSchemasService,
  Schema,
  SchemaInput,
  UpdateSchemaInput,
} from './types';
import { RQLString, rqlBuilder } from '../../rql';

const addTransitionHelpersToSchema = (schema: Schema) => ({
  ...schema,
  findTransitionIdByName(name: string) {
    return schema.transitions?.find(transition => transition.name === name)?.id;
  },
  get transitionsByName() {
    return schema.transitions?.reduce(
      (memo, transition) => ({ ...memo, [transition.name]: transition }),
      {}
    );
  },
});

export default (client, httpAuth: HttpInstance): DataSchemasService => ({
  async create(requestBody: SchemaInput): Promise<Schema> {
    return addTransitionHelpersToSchema(
      (await client.post(httpAuth, '/', requestBody)).data
    );
  },

  async find(options?: { rql?: RQLString }): Promise<PagedResult<Schema>> {
    const result = (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
    return {
      ...result,
      data: result.data.map(addTransitionHelpersToSchema),
    };
  },

  async findById(id: ObjectId, options?: { rql?: RQLString }): Promise<Schema> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  async findByName(
    name: string,
    options?: { rql?: RQLString }
  ): Promise<Schema> {
    const rqlWithName = rqlBuilder(options?.rql).eq('name', name).build();
    const res = await this.find({ rql: rqlWithName });
    return res.data[0];
  },

  async findFirst(options?: { rql?: RQLString }): Promise<Schema> {
    const res = await this.find(options);
    return res.data[0];
  },

  async update(
    schemaId: ObjectId,
    requestBody: UpdateSchemaInput
  ): Promise<AffectedRecords> {
    return (await client.put(httpAuth, `/${schemaId}`, requestBody)).data;
  },

  async remove(schemaId: ObjectId): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/${schemaId}`)).data;
  },

  async disable(schemaId: ObjectId): Promise<AffectedRecords> {
    return (await client.post(httpAuth, `/${schemaId}/disable`)).data;
  },

  async enable(schemaId: ObjectId): Promise<AffectedRecords> {
    return (await client.post(httpAuth, `/${schemaId}/enable`)).data;
  },
});
