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
