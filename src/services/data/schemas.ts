import type { HttpInstance } from '../../types';
import type { PagedResult } from '../types';
import type { DataSchemasService, Schema } from './types';
import { rqlBuilder } from '../../rql';
import { HttpClient } from '../http-client';

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

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DataSchemasService => ({
  /**
   * Create a schema
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param requestBody
   * @returns Schema successful operation
   */
  async create(requestBody, options) {
    return addTransitionHelpersToSchema(
      (await client.post(httpAuth, '/', requestBody, options)).data
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
  async find(options) {
    const result: PagedResult<Schema> = (
      await client.get(httpAuth, `/${options?.rql || ''}`, options)
    ).data;
    return {
      ...result,
      data: result.data.map(addTransitionHelpersToSchema),
    };
  },

  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findById(this: DataSchemasService, id, options) {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ ...options, rql: rqlWithId });
    return res.data[0];
  },

  /**
   * Find By Name
   * @param name the name to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findByName(this: DataSchemasService, name, options) {
    const rqlWithName = rqlBuilder(options?.rql).eq('name', name).build();
    const res = await this.find({ ...options, rql: rqlWithName });
    return res.data[0];
  },

  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findFirst(options) {
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
  async update(schemaId, requestBody, options) {
    return (await client.put(httpAuth, `/${schemaId}`, requestBody, options))
      .data;
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
  async remove(schemaId, options) {
    return (await client.delete(httpAuth, `/${schemaId}`, options)).data;
  },

  /**
   * Disable a schema
   * Permission | Scope | Effect
   * - | - | -
   * `DISABLE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @returns AffectedRecords
   */
  async disable(schemaId, options) {
    return (await client.post(httpAuth, `/${schemaId}/disable`, null, options))
      .data;
  },

  /**
   * Enable a schema
   * Permission | Scope | Effect
   * - | - | -
   * `DISABLE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @returns AffectedRecords
   */
  async enable(schemaId, options) {
    return (await client.post(httpAuth, `/${schemaId}/enable`, options)).data;
  },
});
