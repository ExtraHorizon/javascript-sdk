import { RQLString } from '../../rql';
import {
  ObjectId,
  LanguageCode,
  MailAddress,
  MailAddressList,
  MailRecipients,
  AffectedRecords,
  PagedResult,
  PagedResultWithPager,
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
  health(this: MailsService): Promise<boolean>;
  find: (
    this: MailsService,
    options?: { rql?: RQLString }
  ) => Promise<PagedResultWithPager<Mail>>;
  findById: (
    this: MailsService,
    id: ObjectId,
    options?: { rql?: RQLString }
  ) => Promise<Mail>;
  findFirst(this: MailsService, options?: { rql?: RQLString }): Promise<Mail>;
  send(
    this: MailsService,
    requestBody?: PlainMailCreation | TemplateBasedMailCreation
  ): Promise<Mail>;
  track(this: MailsService, trackingHash: string): Promise<AffectedRecords>;
  findOutbound(
    this: MailsService,
    options?: { rql?: string }
  ): Promise<PagedResult<QueuedMail>>;
}
