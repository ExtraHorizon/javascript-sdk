export interface ListResponse {
  query: string;
  page: {
    total: number;
    offset: number;
    limit: number;
  };
}

export interface AffectedRecordsResponse {
  affectedRecords: number;
}

export interface ResultResponse {
  status: number;
}
