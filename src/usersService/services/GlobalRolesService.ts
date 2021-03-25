/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GlobalPermission } from '../models/GlobalPermission';
import type { ObjectId } from '../models/ObjectId';
import type { PagedResult } from '../models/PagedResult';
import type { Role } from '../models/Role';
import type { RolePermissionsBean } from '../models/RolePermissionsBean';
import type { UserRolesBean } from '../models/UserRolesBean';
import { request as __request } from '../core/request';

export class GlobalRolesService {

    /**
     * Retrieve a list of permissions
     * Permission | Scope | Effect
     * - | - | -
     * none |  | Everyone can use this endpoint
     *
     * @returns any Success
     * @throws ApiError
     */
    public static async getGlobalRolesService(): Promise<(PagedResult & {
        data?: Array<GlobalPermission>,
    })> {
        const result = await __request({
            method: 'GET',
            path: `/permissions`,
        });
        return result.body;
    }

    /**
     * Retrieve a list of roles
     * Permission | Scope | Effect
     * - | - | -
     * `VIEW_ROLE` | `global` | **Required** for this endpoint
     *
     * @param rql Add filters to the requested list.
     * @returns any Success
     * @throws ApiError
     */
    public static async getGlobalRolesService1(
        rql?: string,
    ): Promise<(PagedResult & {
        data?: Array<Role>,
    })> {
        const result = await __request({
            method: 'GET',
            path: `/roles`,
            query: {
                'RQL': rql,
            },
        });
        return result.body;
    }

    /**
     * Create a role
     * Permission | Scope | Effect
     * - | - | -
     * `CREATE_ROLE` | `global` | **Required** for this endpoint
     *
     * @param rql Add filters to the requested list.
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static async postGlobalRolesService(
        rql?: string,
        requestBody?: {
            name: string,
            description: string,
        },
    ): Promise<{
        id?: ObjectId,
        name?: string,
        description?: string,
        permissions?: Array<GlobalPermission>,
        creation_timestamp?: number,
        update_timestamp?: number,
    }> {
        const result = await __request({
            method: 'POST',
            path: `/roles`,
            query: {
                'RQL': rql,
            },
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Delete a role
     * Permission | Scope | Effect
     * - | - | -
     * `DELETE_ROLE` | `global` | **Required** for this endpoint
     *
     * @param rql Add filters to the requested list.
     * @returns any Operation successful
     * @throws ApiError
     */
    public static async deleteGlobalRolesService(
        rql: string,
    ): Promise<{
        records_affected?: number,
    }> {
        const result = await __request({
            method: 'DELETE',
            path: `/roles`,
            query: {
                'RQL': rql,
            },
            errors: {
                404: `Error response`,
            },
        });
        return result.body;
    }

    /**
     * Update a role
     * Permission | Scope | Effect
     * - | - | -
     * `UPDATE_ROLE` | `global` | **Required** for this endpoint
     *
     * @param id Id of the targeted role
     * @param requestBody
     * @returns Role Success
     * @throws ApiError
     */
    public static async putGlobalRolesService(
        id: ObjectId,
        requestBody?: {
            name?: string,
            description?: string,
        },
    ): Promise<Role> {
        const result = await __request({
            method: 'PUT',
            path: `/roles/${id}`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Add permissions to a role
     * Permission | Scope | Effect
     * - | - | -
     * `ADD_ROLE_PERMISSIONS` | `global` | **Required** for this endpoint
     *
     * @param requestBody
     * @returns any Operation successful
     * @throws ApiError
     */
    public static async postGlobalRolesService1(
        requestBody?: RolePermissionsBean,
    ): Promise<{
        records_affected?: number,
    }> {
        const result = await __request({
            method: 'POST',
            path: `/roles/add_permissions`,
            body: requestBody,
            errors: {
                404: `Error response`,
            },
        });
        return result.body;
    }

    /**
     * Remove permissions from roles
     * Permission | Scope | Effect
     * - | - | -
     * `REMOVE_ROLE_PERMISSIONS` | `global` | **Required** for this endpoint
     *
     * @param rql Add filters to the requested list.
     * @param requestBody
     * @returns any Operation successful
     * @throws ApiError
     */
    public static async postGlobalRolesService2(
        rql: string,
        requestBody?: RolePermissionsBean,
    ): Promise<{
        records_affected?: number,
    }> {
        const result = await __request({
            method: 'POST',
            path: `/roles/remove_permissions`,
            query: {
                'RQL': rql,
            },
            body: requestBody,
            errors: {
                404: `Error response`,
            },
        });
        return result.body;
    }

    /**
     * Add roles to users
     * Permission | Scope | Effect
     * - | - | -
     * `ADD_ROLE_TO_USER` | `global` | **Required** for this endpoint
     *
     * @param rql Add filters to the requested list.
     * @param requestBody
     * @returns any Operation successful
     * @throws ApiError
     */
    public static async postGlobalRolesService3(
        rql?: string,
        requestBody?: UserRolesBean,
    ): Promise<{
        records_affected?: number,
    }> {
        const result = await __request({
            method: 'POST',
            path: `/add_roles`,
            query: {
                'RQL': rql,
            },
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Remove roles from users
     * Permission | Scope | Effect
     * - | - | -
     * `REMOVE_ROLE_FROM_USER` | `global` | **Required** for this endpoint
     *
     * @param rql Add filters to the requested list.
     * @param requestBody
     * @returns any Operation successful
     * @throws ApiError
     */
    public static async postGlobalRolesService4(
        rql: string,
        requestBody?: UserRolesBean,
    ): Promise<{
        records_affected?: number,
    }> {
        const result = await __request({
            method: 'POST',
            path: `/remove_roles`,
            query: {
                'RQL': rql,
            },
            body: requestBody,
        });
        return result.body;
    }

}