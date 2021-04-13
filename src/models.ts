export interface listResponse {
  query: string;
  page: { total: number; offset: number; limit: number };
}

export interface affectedRecordsResponse {
  affectedRecords: number;
}

export interface resultResponse {
  status: number;
}

export enum Results {
  Success = 200,
}
