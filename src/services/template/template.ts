import type { HttpInstance } from '../../types';
import { AffectedRecords } from '../models/Responses';
import { RQLString } from '../../rql';
import type {
  TemplateList,
  TemplateIn,
  TemplateOut,
  CreateFileBean,
} from './types';

// TODO import these types once the types PR is merged
type ResultResponse = any;
enum Results {
  Success = 200,
}

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Perform a health check
   * @permission Everyone can use this endpoint
   * @returns {boolean} success
   */
  async health(): Promise<boolean> {
    const result: ResultResponse = await client.get(httpAuth, '/health');
    return result.status === Results.Success;
  },

  /**
   * Get all templates the service has to offer
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_TEMPLATES` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns any Success
   * @throws {ApiError}
   */
  async find(options?: { rql?: RQLString }): Promise<TemplateList> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  /**
   * Create a new template
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_TEMPLATES` | `global` | **Required** for this endpoint
   *
   * @param requestBody
   * @returns TemplateOut Success
   * @throws {ApiError}
   */
  async createTemplate(requestBody: TemplateIn): Promise<TemplateOut> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },

  /**
   * Update an existing template
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_TEMPLATES` | `global` | **Required** for this endpoint
   *
   * @param templateId Id of the targeted template
   * @param requestBody
   * @returns TemplateOut Success
   * @throws {ResourceUnknownError}
   */
  async updateTemplate(
    templateId: string,
    requestBody: TemplateIn
  ): Promise<TemplateOut> {
    return (await client.put(httpAuth, `/${templateId}`, requestBody)).data;
  },

  /**
   * Delete a template
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_TEMPLATES` | `global` | **Required** for this endpoint
   *
   * @param templateId Id of the targeted template
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  async deleteTemplate(templateId: string): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/${templateId}`)).data;
  },

  /**
   * Resolves a template and presents the result as a pdf file
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param templateId Id of the targeted template
   * @param requestBody
   * @returns any Success
   * @throws {LocalizationKeyMissingError}
   * @throws {TemplateFillingError}
   * @throws {ResourceUnknownError}
   */
  async resolveTemplateAsPdf(
    templateId: string,
    requestBody: CreateFileBean
  ): Promise<any> {
    return (await client.post(httpAuth, `/${templateId}/pdf`, requestBody))
      .data;
  },

  /**
   * @deprecated
   * Resolves a template and presents the result as a pdf file
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param templateId Id of the targeted template
   * @param localizationCode Specifies the language the template must be resolved in
   * @param requestBody
   * @returns any Success
   * @throws {LocalizationKeyMissingError}
   * @throws {TemplateFillingError}
   * @throws {ResourceUnknownError}
   */
  async resolveTemplateAsPdfUsingCode(
    templateId: string,
    localizationCode: string,
    requestBody: CreateFileBean
  ): Promise<any> {
    return (
      await client.post(
        httpAuth,
        `/${templateId}/pdf/${localizationCode}`,
        requestBody
      )
    ).data;
  },

  /**
   * Resolves a template and presents the result as a json response
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param templateId Id of the targeted template
   * @param requestBody
   * @returns string Success
   * @throws {LocalizationKeyMissingError}
   * @throws {TemplateFillingError}
   * @throws {ResourceUnknownError}
   */
  async resolveTemplateAsJson(
    templateId: string,
    requestBody: CreateFileBean
  ): Promise<Record<string, string>> {
    return (await client.post(httpAuth, `/${templateId}/resolve`, requestBody))
      .data;
  },

  /**
   * @deprecated
   * Resolves a template and presents the result as a json response
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param templateId Id of the targeted template
   * @param localizationCode Specifies the language the template must be resolved in
   * @param requestBody
   * @returns string Success
   * @throws {LocalizationKeyMissingError}
   * @throws {TemplateFillingError}
   * @throws {ResourceUnknownError}
   */
  async resolveTemplateAsJsonUsingCode(
    templateId: string,
    localizationCode: string,
    requestBody: CreateFileBean
  ): Promise<Record<string, string>> {
    return (
      await client.post(
        httpAuth,
        `/${templateId}/resolve/${localizationCode}`,
        requestBody
      )
    ).data;
  },
});
