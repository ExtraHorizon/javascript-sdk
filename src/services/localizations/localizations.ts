import type { HttpInstance } from '../../types';
import { AffectedRecords, PagedResult } from '../types';
import { RQLString } from '../../rql';
import type {
  Localization,
  BulkLocalizationBean,
  BulkCreationResponseBean,
  BulkUpdateResponseBean,
  LocalizationRequestBean,
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
   * @returns any Success
   * @throws ApiError
   */
  async find(options?: {
    rql?: RQLString;
  }): Promise<PagedResult<Localization>> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  /**
   * Create new localizations
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_LOCALIZATIONS` | global | **Required** for this endpoint
   *
   * @param requestBody
   * @returns BulkCreationResponseBean Success
   * @throws ApiError
   */
  async create(
    requestBody: BulkLocalizationBean
  ): Promise<BulkCreationResponseBean> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },

  /**
   * Update localizations
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_LOCALIZATIONS` | global | **Required** for this endpoint
   *
   * @param requestBody
   * @returns BulkUpdateResponseBean Success
   * @throws ApiError
   */
  async update(
    requestBody: BulkLocalizationBean
  ): Promise<BulkUpdateResponseBean> {
    return (await client.put(httpAuth, '/', requestBody)).data;
  },

  /**
   * Delete localizations
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_LOCALIZATIONS` | global | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list, **required**.
   * @returns any Operation successful
   * @throws ApiError
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
   * @param requestBody
   * @returns MappedText Success
   * @throws ApiError
   */
  async getByKeys(
    requestBody: LocalizationRequestBean
  ): Promise<Record<string, MappedText>> {
    return (await client.post(httpAuth, '/request', requestBody)).data;
  },
});
