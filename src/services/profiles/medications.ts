import type { HttpInstance } from '../../types';
import { AffectedRecords, ObjectId, PagedResult } from '../types';
import { Medication } from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Retrieve a list of all the defined medications
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @returns PagedResult<Medication>
   */
  async getMedications(): Promise<PagedResult<Medication>> {
    return (await client.get(httpAuth, '/medication')).data;
  },

  /**
   * Add a new medicine to a specified profile
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_PROFILES` | `staff enlistment` | Add a new medicine to a profile for this group
   * `UPDATE_PROFILES` | `global` | Add a new medicine to a profile for any group
   *
   * @param profileId Id of the targeted profile
   * @param requestBody Medication data
   * @returns Medication
   * @throws {ResourceUnknownError}
   */
  async addMedicationToProfile(
    profileId: ObjectId,
    requestBody: Medication
  ): Promise<Medication> {
    return (
      await client.post(httpAuth, `/${profileId}/medication`, requestBody)
    ).data;
  },

  /**
   * Remove a medicine from a specified profile
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_PROFILES` | `staff enlistment` | Remove a medicine from a profile for this group
   * `UPDATE_PROFILES` | `global` | Remove a medicine from a profile for any group
   *
   * @param profileId Id of the targeted profile
   * @param medicationName Name of the targeted medication
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  async removeMedicationFromProfile(
    profileId: ObjectId,
    medicationName: string
  ): Promise<AffectedRecords> {
    return (
      await client.delete(
        httpAuth,
        `/${profileId}/medication/${medicationName}`
      )
    ).data;
  },
});
