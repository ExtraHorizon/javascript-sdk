/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PagedResult = {
    query?: string;
    page?: {
        total?: number,
        offset?: number,
        limit?: number,
    };
}
