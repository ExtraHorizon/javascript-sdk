export interface listResponse {
  query: string;
  page: { total: number, offset: number, limit: number},
}

export interface recordsAffectedResponse {
 recordsAffected: number;
}
