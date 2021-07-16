import type { HttpInstance } from '../../types';
import type { AffectedRecords } from '../types';
import type { ConfigurationsGeneralService } from './types';
import { HttpClient } from '../http-client';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ConfigurationsGeneralService => ({
  /**
   * View the general configuration.
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @returns GeneralConfiguration
   */
  async get(options) {
    return (await client.get(httpAuth, '/general', options)).data;
  },

  /**
   * Update the general configuration
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_CONFIGURATIONS` | `global` | Required for this endpoint
   *
   * @param requestBody GeneralConfigurationInput
   * @param rql Add filters to the requested list.
   * @returns AffectedRecords
   */
  async update(requestBody, options) {
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
   * @param requestBody list of fields to remove
   * @param rql Add filters to the requested list.
   * @returns AffectedRecords
   */
  async removeFields(requestBody, options): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/general/deleteFields${options?.rql || ''}`,
        requestBody,
        options
      )
    ).data;
  },
});
