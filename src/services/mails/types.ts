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
  TimeZone,
} from '../types';

export interface Mail {
  id: ObjectId;
  creatorId?: ObjectId;
  awsMessageId?: ObjectId;
  subject: string;
  recipients: MailRecipients;
  templateId?: ObjectId;
  templateName?: string;
  replyTo?: MailAddressList;
  from: MailAddress;
  body?: string;
  language?: LanguageCode;
  timeZone?: TimeZone;
  content?: Record<string, any>;
  views: number;
  creationTimestamp: Date;
  updateTimestamp: Date;
}

export type PlainMailCreation = {
  subject: string;
  body: string;
} & CommonMailCreationProperties;

export type TemplateBasedMailCreation = {
  templateId?: ObjectId;
  templateName?: string;
  language?: LanguageCode;
  timeZone?: TimeZone;
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
  id: ObjectId;
  status: QueuedMailStatus;
  from: string;
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
    templateName?: string;
    credentials?: {
      serviceId?: ObjectId;
      applicationId?: ObjectId;
      userId?: ObjectId;
    };
    language?: LanguageCode;
    timeZone?: string;
    content?: Record<string, any>;
  };
  creationTimestamp: Date;
  updateTimestamp: Date;
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
   */
  find(options?: OptionsWithRql): Promise<PagedResult<Mail>>;

  /**
   * Retrieve a list of mails
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_MAILS` | `global` | **Required** for this endpoint
   */
  findAll(options?: OptionsWithRql): Promise<Mail[]>;

  /**
   * Find By Id
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_MAILS` | `global` | **Required** for this endpoint
   */
  findById(id: ObjectId, options?: OptionsWithRql): Promise<Mail | undefined>;

  /**
   * Find First
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_MAILS` | `global` | **Required** for this endpoint
   */
  findFirst(options?: OptionsWithRql): Promise<Mail | undefined>;

  /**
   * Send a mail
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Send mails to your own email address
   * none | `staff enlistment` | Send any mail to your patients or send a template mail based on pre-configured allowed templates to any email address.
   * `SEND_MAILS` | `global` | Send mails to any email address
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
   */
  track(trackingHash: string, options?: OptionsBase): Promise<AffectedRecords>;

  /**
   * Retrieve the list of mails that are not sent yet
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_MAILS` | `global` | **Required** for this endpoint
   */
  findOutbound(options?: OptionsWithRql): Promise<PagedResult<QueuedMail>>;
}
