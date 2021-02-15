export interface listResponse {
  query: string;
  page: { total: number, offset: number, limit: number },
}

export interface recordsAffectedResponse {
  recordsAffected: number;
}

export interface recordsAffectedResponseSnake {
  records_affected: number;
}

export interface resultResponse {
  status: number;
}

export enum Results {
  Success = 200
}
