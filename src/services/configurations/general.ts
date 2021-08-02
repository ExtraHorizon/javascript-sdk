import type { HttpInstance } from '../../types';
import type { AffectedRecords } from '../types';
import type {
  ConfigurationsGeneralService,
  GeneralConfiguration,
  GeneralConfigurationInput,
} from './types';
import type { RQLString } from '../../rql';

export default (
  client,
  httpAuth: HttpInstance
): ConfigurationsGeneralService => ({
  async get(): Promise<GeneralConfiguration> {
    return (await client.get(httpAuth, '/general')).data;
  },

  async update(
    requestBody: GeneralConfigurationInput,
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords> {
    return (
      await client.put(httpAuth, `/general${options?.rql || ''}`, requestBody)
    ).data;
  },

  async removeFields(
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
