export interface PagedResult {
  query: string;
  page: {
    total: number;
    offset: number;
    limit: number;
  };
}

export interface AffectedRecords {
  affectedRecords: number;
}

export interface ResultResponse {
  status: number;
}
