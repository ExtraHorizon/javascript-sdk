import { RQLString } from '../rql';

export type LanguageCode = string;

export type ObjectId = string;

export interface Entity {
  id?: ObjectId;
}

export interface Timestamps {
  updateTimestamp?: Date;
  creationTimestamp?: Date;
}

export interface ErrorResponse {
  code?: number;
  name?: string;
  message?: string;
}

export interface PagedResult<T> {
  page: {
    total: number;
    offset: number;
    limit: number;
  };
  data: T[];
}

export interface AffectedRecords {
  affectedRecords: number;
}

export interface ResultResponse {
  status: number;
}

export enum Results {
  Success = 200,
}

/**
 * Supported timezones from [Java.time.zoneId](https://docs.oracle.com/javase/8/docs/api/java/time/ZoneId.html#of-java.lang.String-)
 */
export type TimeZone = string;

export type MailAddress = string;

export type MailAddressList = MailAddress[];

export interface MailRecipients {
  to: MailAddressList;
  cc?: MailAddressList;
  bcc?: MailAddressList;
}

export type Headers = Record<string, string>;
export type OptionsBase = { headers?: Headers };
export type OptionsWithRql = OptionsBase & { rql?: RQLString };
export type OmitThisParameterDeep<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]: T[P] extends Function
    ? OmitThisParameter<T[P]>
    : OmitThisParameterDeep<T[P]>;
};
