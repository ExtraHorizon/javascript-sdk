import {
  ObjectId,
  LanguageCode,
  MailAddress,
  MailAddressList,
  MailRecipients,
  AffectedRecords,
  PagedResult,
  OptionsBase,
  OptionsWithRql,
} from '../types';

export interface Mail {
  id?: ObjectId;
  creatorId?: ObjectId;
  awsMessageId?: ObjectId;
  subject?: string;
  recipients?: MailRecipients;
  templateId?: ObjectId;
  replyTo?: MailAddressList;
  from?: MailAddress;
  body?: string;
  language?: LanguageCode;
  content?: Record<string, any>;
  views?: number;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}

export type PlainMailCreation = {
  subject: string;
  body: string;
} & CommonMailCreationProperties;

export type TemplateBasedMailCreation = {
  templateId: ObjectId;
  language?: LanguageCode;
  content: Record<string, any>;
} & CommonMailCreationProperties;

export interface CommonMailCreationProperties {
  recipients: MailRecipients;
  from?: MailAddress;
  replyTo?: MailAddressList;
  attachments?: Attachment[];
}

export interface Attachment {
  name: string;
  /**
   * Base64 encoded binary data
   */
  content: string;
  /**
   * MIME Type of the file
   */
  type?: string;
}

export interface QueuedMail {
  id?: ObjectId;
  status?: QueuedMailStatus;
  from?: string;
  to?: MailAddressList;
  cc?: MailAddressList;
  bcc?: MailAddressList;
  replyTo?: MailAddress;
  subject?: string;
  text?: string;
  html?: string;
  attachments?: QueuedMailAttachment[];
  encoding?: string;
  textEncoding?: string;
  templateData?: {
    templateId?: ObjectId;
    credentials?: {
      serviceId?: ObjectId;
      applicationId?: ObjectId;
      userId?: ObjectId;
    };
    language?: LanguageCode;
    content?: Record<string, any>;
  };
}

export interface QueuedMailAttachment {
  filename?: string;
  content?: string;
  encoding?: string;
}

export enum QueuedMailStatus {
  QUEUED = 'queued',
  SENDING = 'sending',
  FAILED = 'failed',
}

export interface MailsService {
  /**
   * Perform a health check for mail service
   * @returns {boolean} success
   */
  health(options?: OptionsBase): Promise<boolean>;
  /**
   * Retrieve a list of mails
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_MAILS` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Mail>
   */
  find: (options?: OptionsWithRql) => Promise<PagedResult<Mail>>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findById: (id: ObjectId, options?: OptionsWithRql) => Promise<Mail>;
  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(options?: OptionsWithRql): Promise<Mail>;
  /**
   * Send a mail
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Send mails to your own email address
   * none | `staff enlistment` | Send any mail to your patients or send a template mail based on pre-configured allowed templates to any email address.
   * `SEND_MAILS` | `global` | Send mails to any email address
   * @param requestBody mail creation data
   * @returns Mail
   * @throws {NotActivatedError}
   */
  send(
    requestBody: PlainMailCreation | TemplateBasedMailCreation,
    options?: OptionsBase
  ): Promise<Mail>;
  /**
   * Register a mail being opened
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   * @param trackingHash
   * @returns AffectedRecords
   */
  track(trackingHash: string, options?: OptionsBase): Promise<AffectedRecords>;
  /**
   * Retrieve the list of mails that are not sent yet
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_MAILS` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @returns PagedResult<QueuedMail>
   */
  findOutbound(options?: OptionsWithRql): Promise<PagedResult<QueuedMail>>;
}
