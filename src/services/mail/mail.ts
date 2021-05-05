import type { HttpInstance } from '../../types';
import { AffectedRecords } from '../models/Responses';
import { RQLString } from '../../rql';

type PagedResult = unknown;
type Mail = unknown;
type PlainMailCreation = unknown;
type TemplateBasedMailCreation = unknown;
type QueuedMail = unknown;

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Retrieve a list of mails
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_MAILS` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns any Success
   * @throws {ApiError}
   */
  async find(options?: {
    rql?: RQLString;
  }): Promise<
    PagedResult & {
      data?: Array<Mail>;
    }
  > {
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
   * @throws {ApiError}
   */
  async sendMail(
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
   * @throws {ApiError}
   */
  async trackMail(trackingHash: string): Promise<AffectedRecords> {
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
   * @throws {ApiError}
   */
  async findOutboundMails(options?: {
    rql?: string;
  }): Promise<
    PagedResult & {
      data?: Array<QueuedMail>;
    }
  > {
    return (await client.get(httpAuth, `/queued${options?.rql || ''}`)).data;
  },
});
