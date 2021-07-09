import type { HttpInstance } from '../../types';
import {
  AffectedRecords,
  PagedResult,
  ResultResponse,
  Results,
  ObjectId,
  PagedResultWithPager,
} from '../types';
import { RQLString, rqlBuilder } from '../../rql';
import {
  Mail,
  QueuedMail,
  PlainMailCreation,
  TemplateBasedMailCreation,
  MailsService,
} from './types';
import { addPagers } from '../utils';

export default (client, httpAuth: HttpInstance): MailsService => ({
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
   * @returns PagedResult<Mail>
   */
  async find(options?: {
    rql?: RQLString;
  }): Promise<PagedResultWithPager<Mail>> {
    const result = (await client.get(httpAuth, `/${options?.rql || ''}`)).data;

    return addPagers.call(this, options?.rql, result);
  },

  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findById(id: ObjectId, options?: { rql?: RQLString }): Promise<Mail> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findFirst(options?: { rql?: RQLString }): Promise<Mail> {
    const res = await this.find(options);
    return res.data[0];
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
   * @returns PagedResult<QueuedMail>
   */
  async findOutbound(options?: {
    rql?: string;
  }): Promise<PagedResult<QueuedMail>> {
    return (await client.get(httpAuth, `/queued${options?.rql || ''}`)).data;
  },
});
