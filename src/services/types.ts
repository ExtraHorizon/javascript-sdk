import { RQLString } from '../rql';

export type LanguageCode = string;

export type ObjectId = string;

export interface Entity {
  id: ObjectId;
}

export interface Timestamps {
  updateTimestamp: Date;
  creationTimestamp: Date;
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
 * IANA time zone identifier (e.g. "Europe/Brussels").
 * We aim to stay aligned with the official IANA time zone database.
 * In practice, supported values closely match those returned by Intl.supportedValuesOf('timeZone') in JavaScript.
 * For an overview of IANA time zones, see: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
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
export type OptionsBase = {
  /** Added to all HTTP verbs */
  headers?: Headers;
  /** Only passed to the GET requests. Will retry 4 times on 500 errors */
  shouldRetry?: boolean;
  /**
   * @deprecated this property is only meant to be used for backwards compatibility when upgrading to v8.0.0.
   *
   * Key names that are not chosen by Extra Horizon where also affected by the data normalization before v8.0.0.
   * They were converted from camel case to snake case before sending the request and the other way around before
   * providing the response.
   *
   * Also fields ending with the name timestamp not chosen by extra horizon in custom properties where automatically
   * converted to dates. Even though they could be just booleans, strings or numbers. Dates provided in such fields will
   * now be converted to strings while all other types will stay as they are.
   *
   * To enable this behaviour again, set to true.
   */
  normalizeCustomData?: boolean;
};
export type OptionsWithRql = OptionsBase & { rql?: RQLString; };

export interface FileUploadOptions extends OptionsBase {
    onUploadProgress?: (progress: { loaded: number; total: number; }) => void;

    /**
     * AbortSignal to cancel the file upload.
     *
     * Example usage:
     * ```typescript
     * const controller = new AbortController();
     * const signal = controller.signal;
     *
     * try {
     *   await exh.files.create(file, { signal });
     * } catch (error) {
     *   if (error instanceof RequestAbortedError) {
     *     console.log('File upload was cancelled, ignoring error');
     *     return;
     *   }
     *   throw error; // Handle other errors
     * }
     *
     * // To cancel the upload, call:
     * controller.abort();
     * ```
     */
    signal?: AbortSignal;
}

export type PagedResultWithPager<T> = PagedResult<T> & {
  previous: () => Promise<PagedResultWithPager<T>>;
  next: () => Promise<PagedResultWithPager<T>>;
};
