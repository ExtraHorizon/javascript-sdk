import type { HttpInstance } from '../../types';
import { AffectedRecords, PagedResult, ObjectId } from '../types';
import { RQLString, rqlBuilder } from '../../rql';
import { Profile, ProfileCreation, Comorbidities, Impediments } from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Get a list of profiles
   * Permission | Scope | Effect
   * - | - | -
   * none | | View your profile
   * none | `staff enlistment` | View all the profiles of the group
   * `VIEW_PATIENTS` | `global` | View all profiles
   *
   * @param rql an optional rql string
   * @returns PagedResult<Profile>
   */
  async find(options?: { rql?: RQLString }): Promise<PagedResult<Profile>> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findById(
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Profile> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findFirst(options?: { rql?: RQLString }): Promise<Profile> {
    const res = await this.find(options);
    return res.data[0];
  },

  /**
   * Create a new profile
   * Permission | Scope | Effect
   * - | - | -
   * none | | Create a profile for the current user
   * `CREATE_PROFILES` | `global` | Create a profile for any user
   *
   * @param requestBody
   * @returns Profile
   * @throws {ProfileAlreadyExistsError}
   */
  async create(requestBody: ProfileCreation): Promise<Profile> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },

  /**
   * Update an existing profile
   * Permission | Scope | Effect
   * - | - | -
   * none | | Update your profile
   * `UPDATE_PROFILES` | `staff enlistment` | Update the profile of any group member
   * `UPDATE_PROFILES` | `global` | Update any profile
   *
   * @param rql Add filters to the requested list, **required**.
   * @param requestBody The Profile data to update
   * @returns AffectedRecords
   */
  async update(rql: RQLString, requestBody: Profile): Promise<AffectedRecords> {
    return (await client.put(httpAuth, `/${rql}`, requestBody)).data;
  },

  /**
   * Remove a given field from all profile records
   * To make a selection of profiles, use RQL.
   * Permission | Scope | Effect
   * - | - | -
   * none | | Remove a given field from your profile
   * `UPDATE_PROFILES` | `staff enlistment` | Remove a given field from any group member
   * `UPDATE_PROFILES` | `global` | Remove a given field from any profile
   *
   * @param rql Add filters to the requested list, **required**.
   * @param requestBody the list of fields to remove
   * @returns AffectedRecords
   * @throws {RemoveFieldError}
   */
  async removeFields(
    rql: RQLString,
    requestBody: {
      fields: Array<string>;
    }
  ): Promise<AffectedRecords> {
    return (await client.post(httpAuth, `/remove_fields${rql}`, requestBody))
      .data;
  },

  /**
   * Retrieve a list of all the defined comorbidities
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @returns PagedResult<Comorbidities>
   */
  async getComorbidities(): Promise<PagedResult<Comorbidities>> {
    return (await client.get(httpAuth, '/comorbidities')).data;
  },

  /**
   * Retrieve a list of all the defined impediments
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @returns PagedResult<Impediments>
   */
  async getImpediments(): Promise<PagedResult<Impediments>> {
    return (await client.get(httpAuth, '/impediments')).data;
  },
});
