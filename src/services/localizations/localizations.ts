import type { HttpInstance } from '../../types';
import { AffectedRecords, PagedResult } from '../types';
import { RQLString, rqlBuilder } from '../../rql';
import type {
  Localization,
  BulkLocalization,
  BulkCreationResponse,
  BulkUpdateResponse,
  LocalizationRequest,
  MappedText,
} from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Returns all possible localizations stored in this service
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Localization>
   */
  async find(options?: {
    rql?: RQLString;
  }): Promise<PagedResult<Localization>> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  /**
   * Find By Key
   * @param key the key to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findByKey(
    key: string,
    options?: { rql?: RQLString }
  ): Promise<Localization> {
    const rqlWithKey = rqlBuilder(options?.rql).eq('key', key).build();
    const res = await this.find({ rql: rqlWithKey });
    return res.data[0];
  },

  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findFirst(options?: { rql?: RQLString }): Promise<Localization> {
    const res = await this.find(options);
    return res.data[0];
  },

  /**
   * Create new localizations
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_LOCALIZATIONS` | global | **Required** for this endpoint
   *
   * @param requestBody BulkLocalization
   * @returns BulkCreationResponse
   * @throws {DefaultLocalizationMissingError}
   */
  async create(requestBody: BulkLocalization): Promise<BulkCreationResponse> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },

  /**
   * Update localizations
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_LOCALIZATIONS` | global | **Required** for this endpoint
   *
   * @param requestBody BulkLocalization
   * @returns BulkUpdateResponse
   */
  async update(requestBody: BulkLocalization): Promise<BulkUpdateResponse> {
    return (await client.put(httpAuth, '/', requestBody)).data;
  },

  /**
   * Delete localizations
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_LOCALIZATIONS` | global | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list, **required**.
   * @returns AffectedRecords
   */
  async remove(rql: RQLString): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/${rql || ''}`)).data;
  },

  /**
   * Request localizations of multiple keys in a specific language
   * The default language (EN) is always included in the response as a fallback in case there is no translation available for the specified language
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param requestBody LocalizationRequest
   * @returns Record<string, MappedText>
   */
  async getByKeys(
    requestBody: LocalizationRequest
  ): Promise<Record<string, MappedText>> {
    return (await client.post(httpAuth, '/request', requestBody)).data;
  },
});
