import type { HttpInstance } from '../../types';
import type { AffectedRecords } from '../types';
import type { GeneralConfiguration, GeneralConfigurationInput } from './types';
import type { RQLString } from '../../rql';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * View the general configuration.
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @returns any Success
   * @throws {ApiError}
   */
  async getGeneralConfig(): Promise<GeneralConfiguration> {
    return (await client.get(httpAuth, '/general')).data;
  },

  /**
   * Update the general configuration
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_CONFIGURATIONS` | `global` | Required for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   * @throws {ApiError}
   */
  async updateGeneralConfig(
    requestBody: GeneralConfigurationInput,
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords> {
    return (
      await client.put(httpAuth, `/general${options?.rql || ''}`, requestBody)
    ).data;
  },

  /**
   * Delete fields from the general configuration.
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_CONFIGURATIONS` | `global` | Required for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   * @throws {ApiError}
   */
  async removeFieldsFromGeneralConfig(
    requestBody: {
      fields: Array<string>;
    },
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/general/deleteFields${options?.rql || ''}`,
        requestBody
      )
    ).data;
  },
});
