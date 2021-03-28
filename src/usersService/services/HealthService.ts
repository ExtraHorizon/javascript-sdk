/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { request as __request } from '../core/request';

export class HealthService {

    /**
     * Perform a health check
     * Perform a health check
     * @returns any Success
     * @throws ApiError
     */
    public static async getHealth(): Promise<any> {
        const result = await __request({
            method: 'GET',
            path: `/health`,
        });
        return result.body;
    }

}