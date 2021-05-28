import type { HttpInstance } from '../../types';
import {
  AffectedRecords,
  PagedResult,
  ResultResponse,
  Results,
} from '../types';
import { RQLString } from '../../rql';
import {
  Mail,
  QueuedMail,
  PlainMailCreation,
  TemplateBasedMailCreation,
} from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Perform a health check for mail service
   * @permission Everyone can use this endpoint
   * @returns {boolean} success
   */
  async health(): Promise<boolean> {
    const result: ResultResponse = await client.get(httpAuth, '/health');
    return result.status === Results.Success;
  },

  /**
   * Retrieve a list of mails
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_MAILS` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns any Success
   */
  async find(options?: { rql?: RQLString }): Promise<PagedResult<Mail>> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  /**
   * Send a mail
   * Permission | Scope | Effect
   * - | - | -
   * none | | Send mails to your own email address
   * none | `staff enlistment` | Send any mail to your patients or send a template mail based on pre-configured allowed templates to any email address.
   * `SEND_MAILS` | `global` | Send mails to any email address
   *
   * @param requestBody
   * @returns Mail Success
   * @throws {NotActivatedError}
   */
  async send(
    requestBody?: PlainMailCreation | TemplateBasedMailCreation
  ): Promise<Mail> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },

  /**
   * Register a mail being opened
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param trackingHash
   * @returns any Operation successful
   */
  async track(trackingHash: string): Promise<AffectedRecords> {
    return (await client.get(httpAuth, `/${trackingHash}/open`)).data;
  },

  /**
   * Retrieve the list of mails that are not sent yet
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_MAILS` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns any Success
   */
  async findOutbound(options?: {
    rql?: string;
  }): Promise<PagedResult<QueuedMail>> {
    return (await client.get(httpAuth, `/queued${options?.rql || ''}`)).data;
  },
});
