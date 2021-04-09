export interface PagedResult {
    query?: string;
    page?: {
        total?: number,
        offset?: number,
        limit?: number,
    };
}
