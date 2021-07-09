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
  /**
   * Create a schema
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param requestBody
   * @returns Schema successful operation
   */
  async create(requestBody: SchemaInput): Promise<Schema> {
    return addTransitionHelpersToSchema(
      (await client.post(httpAuth, '/', requestBody)).data
    );
  },

  /**
   * Request a list of schemas
   * Permission | Scope | Effect
   * - | - | -
   * none | | Every one can use this endpoint
   * `DISABLE_SCHEMAS` | `global` | Includes disabled schemas in the response
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Schema>
   */
  async find(options?: { rql?: RQLString }): Promise<PagedResult<Schema>> {
    const result = (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
    return {
      ...result,
      data: result.data.map(addTransitionHelpersToSchema),
    };
  },

  /**
   * Request a list of all schemas
   * Do not pass in an rql with limit operator!
   * Permission | Scope | Effect
   * - | - | -
   * none | | Every one can use this endpoint
   * `DISABLE_SCHEMAS` | `global` | Includes disabled schemas in the response
   * @param rql Add filters to the requested list.
   * @returns Schema[]
   */
  async findAll(options?: { rql?: RQLString }): Promise<Schema[]> {
    // Extra check is needed because this function is call recursively with updated RQL
    // But on the first run, we need to set the limit to the max to optimize
    const result: PagedResult<Schema> = await this.find({
      rql:
        options?.rql && options.rql.includes('limit(')
          ? options.rql
          : rqlBuilder(options?.rql).limit(50).build(),
    });

    return result.page.total > result.page.offset + result.page.limit
      ? [
          ...result.data,
          ...(await this.findAll({
            rql: rqlBuilder(options?.rql)
              .limit(result.page.limit, result.page.offset + result.page.limit)
              .build(),
          })),
        ]
      : result.data;
  },

  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findById(id: ObjectId, options?: { rql?: RQLString }): Promise<Schema> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  /**
   * Find By Name
   * @param name the name to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findByName(
    name: string,
    options?: { rql?: RQLString }
  ): Promise<Schema> {
    const rqlWithName = rqlBuilder(options?.rql).eq('name', name).build();
    const res = await this.find({ rql: rqlWithName });
    return res.data[0];
  },

  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findFirst(options?: { rql?: RQLString }): Promise<Schema> {
    const res = await this.find(options);
    return res.data[0];
  },

  /**
   * Update a schema
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param requestBody The schema input
   * @returns AffectedRecords
   */
  async update(
    schemaId: ObjectId,
    requestBody: UpdateSchemaInput
  ): Promise<AffectedRecords> {
    return (await client.put(httpAuth, `/${schemaId}`, requestBody)).data;
  },

  /**
   * Delete a schema
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @returns AffectedRecords
   * @throws {IllegalStateError}
   */
  async remove(schemaId: ObjectId): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/${schemaId}`)).data;
  },

  /**
   * Disable a schema
   * Permission | Scope | Effect
   * - | - | -
   * `DISABLE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @returns AffectedRecords
   */
  async disable(schemaId: ObjectId): Promise<AffectedRecords> {
    return (await client.post(httpAuth, `/${schemaId}/disable`)).data;
  },

  /**
   * Enable a schema
   * Permission | Scope | Effect
   * - | - | -
   * `DISABLE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @returns AffectedRecords
   */
  async enable(schemaId: ObjectId): Promise<AffectedRecords> {
    return (await client.post(httpAuth, `/${schemaId}/enable`)).data;
  },
});
