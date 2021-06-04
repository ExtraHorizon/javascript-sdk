import { rqlBuilder } from '../../rql';
import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords } from '../types';
import type {
  Transition,
  CreationTransition,
  TransitionInput,
  Schema,
} from './types';
import schemas from './schemas';

const findTransition = (schema: Schema, name: string) =>
  schema.transitions.find(transition => transition.name === name);

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Find a transition by name, given a schema
   */
  findByName: async (
    schema: Schema | ObjectId,
    name: string
  ): Promise<Transition> => {
    if ((<Schema>schema).transitions) {
      return Promise.resolve(findTransition(<Schema>schema, name));
    }
    const schemaId = <ObjectId>schema;
    const rql = rqlBuilder().eq('id', schemaId).build();
    const schemasService = schemas(client, httpAuth);
    const foundSchema: Schema = await schemasService
      .find({ rql })
      .then(res => res.data[0]);
    return findTransition(foundSchema, name);
  },

  /**
   * Update the creation transition
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param requestBody
   * @returns {Promise<AffectedRecords>}
   * @throws {IllegalArgumentError}
   */
  async updateCreation(
    schemaId: ObjectId,
    requestBody: CreationTransition
  ): Promise<AffectedRecords> {
    return (
      await client.put(httpAuth, `/${schemaId}/creationTransition`, requestBody)
    ).data;
  },

  /**
   * Create a transition
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param requestBody
   * @returns {Promise<AffectedRecords>}
   * @throws {IllegalArgumentError}
   */
  async create(
    schemaId: ObjectId,
    requestBody: Transition
  ): Promise<TransitionInput> {
    return (
      await client.post(httpAuth, `/${schemaId}/transitions`, requestBody)
    ).data;
  },

  /**
   * Update a transition
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param transitionId The id of the targeted transition.
   * @param requestBody
   * @returns {Promise<AffectedRecords>}
   * @throws {IllegalArgumentError}
   * @throws {ResourceUnknownError}
   */
  async update(
    schemaId: ObjectId,
    transitionId: ObjectId,
    requestBody: Transition
  ): Promise<AffectedRecords> {
    return (
      await client.put(
        httpAuth,
        `/${schemaId}/transitions/${transitionId}`,
        requestBody
      )
    ).data;
  },

  /**
   * Delete a transition
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param transitionId The id of the targeted transition.
   * @returns {Promise<AffectedRecords>}
   * @throws {ResourceUnknownError}
   */
  async delete(
    schemaId: ObjectId,
    transitionId: ObjectId
  ): Promise<AffectedRecords> {
    return (
      await client.delete(httpAuth, `/${schemaId}/transitions/${transitionId}`)
    ).data;
  },
});
