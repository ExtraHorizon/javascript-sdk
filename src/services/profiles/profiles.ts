import type { HttpInstance } from '../../types';
import { AffectedRecords, PagedResult } from '../types';
import { RQLString } from '../../rql';
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
  async removeFieldsFromProfile(
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
