interface IPagedResult {
    query: string;
    page: {
        total: number,
        offset: number,
        limit: number,
    };
}

export type PagedResult = Partial<IPagedResult>;
