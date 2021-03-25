/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GlobalPermission } from '../models/GlobalPermission';
import type { GroupRolePermissionsBean } from '../models/GroupRolePermissionsBean';
import type { ObjectId } from '../models/ObjectId';
import type { PagedResult } from '../models/PagedResult';
import type { StaffGroupsBean } from '../models/StaffGroupsBean';
import type { StaffRolesBean } from '../models/StaffRolesBean';
import { request as __request } from '../core/request';

export class GroupRolesService {

    /**
     * Retrieve a list of group permissions
     * Permission | Scope | Effect
     * - | - | -
     * none |  | Everyone can use this endpoint
     *
     * @returns any Success
     * @throws ApiError
     */
    public static async getGroupRolesService(): Promise<(PagedResult & {
        data?: Array<GlobalPermission>,
    })> {
        const result = await __request({
            method: 'GET',
            path: `/groups/permissions`,
        });
        return result.body;
    }

    /**
     * Retrieve a list of roles create for the group
     * Permission | Scope | Effect
     * - | - | -
     * none | `staff enlistment` | View the roles for the group
     * `VIEW_GROUP` | `global` | View any group its roles
     *
     * @param groupId Id of the targeted group
     * @param rql Add filters to the requested list.
     * @returns any Success
     * @throws ApiError
     */
    public static async getGroupRolesService1(
        groupId: ObjectId,
        rql?: string,
    ): Promise<(PagedResult & {
        data?: Array<{
            id?: ObjectId,
            group_id?: ObjectId,
            name?: string,
            description?: string,
            permissions?: Array<string>,
            creation_timestamp?: number,
            update_timestamp?: number,
        }>,
    })> {
        const result = await __request({
            method: 'GET',
            path: `/groups/${groupId}/roles`,
            query: {
                'RQL': rql,
            },
        });
        return result.body;
    }

    /**
     * Add role to a group
     * Permission | Scope | Effect
     * - | - | -
     * `CREATE_GROUP_ROLE` | `staff enlistment` | Create a role for any group
     * `CREATE_GROUP_ROLE` | `global` | Create a role for the group
     *
     * @param groupId Id of the targeted group
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static async postGroupRolesService(
        groupId: ObjectId,
        requestBody?: {
            name: string,
            description: string,
        },
    ): Promise<{
        id?: ObjectId,
        group_id?: ObjectId,
        name?: string,
        permissions?: Array<string>,
        creation_timestamp?: number,
        update_timestamp?: number,
    }> {
        const result = await __request({
            method: 'POST',
            path: `/groups/${groupId}/roles`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Update a group role
     * Permission | Scope | Effect
     * - | - | -
     * `UPDATE_GROUP_ROLE` | `staff enlistment` | Update a role for the group
     * `UPDATE_GROUP_ROLE` | `global` | Update a role for any group
     *
     * @param groupId Id of the targeted group
     * @param roleId Id of the targeted role
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static async putGroupRolesService(
        groupId: ObjectId,
        roleId: ObjectId,
        requestBody?: {
            name?: string,
            description?: string,
        },
    ): Promise<{
        id?: ObjectId,
        group_id?: ObjectId,
        name?: string,
        description?: string,
        permissions?: Array<string>,
        creation_timestamp?: number,
        update_timestamp?: number,
    }> {
        const result = await __request({
            method: 'PUT',
            path: `/groups/${groupId}/roles/${roleId}`,
            body: requestBody,
            errors: {
                404: `Error response`,
            },
        });
        return result.body;
    }

    /**
     * Remove a role from a group
     * Permission | Scope | Effect
     * - | - | -
     * `DELETE_GROUP_ROLE` | `staff enlistment` | Delete a role for the group
     * `DELETE_GROUP_ROLE` | `global` | Delete a role from any group
     *
     * @param groupId Id of the targeted group
     * @param roleId Id of the targeted role
     * @param rql Add filters to the requested list.
     * @returns any Operation successful
     * @throws ApiError
     */
    public static async deleteGroupRolesService(
        groupId: ObjectId,
        roleId: ObjectId,
        rql: string,
    ): Promise<{
        records_affected?: number,
    }> {
        const result = await __request({
            method: 'DELETE',
            path: `/groups/${groupId}/roles/${roleId}`,
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
     * Add permissions to group roles
     * Permission | Scope | Effect
     * - | - | -
     * `ADD_GROUP_ROLE_PERMISSION` | `staff enlistment` | Add permissions to roles of the group
     * `ADD_GROUP_ROLE_PERMISSION` | `global` | Add permissions to roles of any group
     *
     * @param groupId Id of the targeted group
     * @param rql Add filters to the requested list.
     * @param requestBody
     * @returns any Operation successful
     * @throws ApiError
     */
    public static async postGroupRolesService1(
        groupId: ObjectId,
        rql?: string,
        requestBody?: GroupRolePermissionsBean,
    ): Promise<{
        records_affected?: number,
    }> {
        const result = await __request({
            method: 'POST',
            path: `/groups/${groupId}/roles/add_permissions`,
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
     * Remove permissions from group roles
     * Permission | Scope | Effect
     * - | - | -
     * `REMOVE_GROUP_ROLE_PERMISSION` | `staff enlistment` | Remove permissions from roles of the group
     * `REMOVE_GROUP_ROLE_PERMISSION` | `global` | Remove permissions from roles of any group
     *
     * @param groupId Id of the targeted group
     * @param rql Add filters to the requested list.
     * @param requestBody
     * @returns any Operation successful
     * @throws ApiError
     */
    public static async postGroupRolesService2(
        groupId: ObjectId,
        rql: string,
        requestBody?: GroupRolePermissionsBean,
    ): Promise<{
        records_affected?: number,
    }> {
        const result = await __request({
            method: 'POST',
            path: `/groups/${groupId}/roles/remove_permissions`,
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
     * Assign roles to staff members of a group
     * Permission | Scope | Effect
     * - | - | -
     * `ADD_GROUP_ROLE_TO_STAFF` | `staff enlistment` | Assign roles for the group
     * `ADD_GROUP_ROLE_TO_STAFF` | `global` | Assign roles for any group
     *
     * @param groupId Id of the targeted group
     * @param rql Add filters to the requested list.
     * @param requestBody
     * @returns any Operation successful
     * @throws ApiError
     */
    public static async postGroupRolesService3(
        groupId: ObjectId,
        rql?: string,
        requestBody?: StaffRolesBean,
    ): Promise<{
        records_affected?: number,
    }> {
        const result = await __request({
            method: 'POST',
            path: `/groups/${groupId}/staff/add_roles`,
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
     * Remove roles from staff members of a group
     * Permission | Scope | Effect
     * - | - | -
     * `REMOVE_GROUP_ROLE_FROM_STAFF` | `staff enlistment` | Remove roles from staff of the group
     * `REMOVE_GROUP_ROLE_FROM_STAFF` | `global` | Remove roles from staff of any group
     *
     * @param groupId Id of the targeted group
     * @param rql Add filters to the requested list.
     * @param requestBody
     * @returns any Operation successful
     * @throws ApiError
     */
    public static async postGroupRolesService4(
        groupId: ObjectId,
        rql: string,
        requestBody?: StaffRolesBean,
    ): Promise<{
        records_affected?: number,
    }> {
        const result = await __request({
            method: 'POST',
            path: `/groups/${groupId}/staff/remove_roles`,
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
     * Add users to staff
     * Permission | Scope | Effect
     * - | - | -
     * `ADD_STAFF` | `staff enlistment` | Add staff to the group
     * `ADD_STAFF` | `global` | Add staff to any group
     *
     * @param rql Add filters to the requested list.
     * @param requestBody
     * @returns any Operation successful
     * @throws ApiError
     */
    public static async postGroupRolesService5(
        rql?: string,
        requestBody?: StaffGroupsBean,
    ): Promise<{
        records_affected?: number,
    }> {
        const result = await __request({
            method: 'POST',
            path: `/add_to_staff`,
            query: {
                'RQL': rql,
            },
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Remove users from staff
     * Permission | Scope | Effect
     * - | - | -
     * `ADD_STAFF` | `staff enlistment` | Remove staff from the group
     * `ADD_STAFF` | `global` | Remove staff from any group
     *
     * @param rql Add filters to the requested list.
     * @param requestBody
     * @returns any Operation successful
     * @throws ApiError
     */
    public static async postGroupRolesService6(
        rql: string,
        requestBody?: StaffGroupsBean,
    ): Promise<{
        records_affected?: number,
    }> {
        const result = await __request({
            method: 'POST',
            path: `/remove_from_staff`,
            query: {
                'RQL': rql,
            },
            body: requestBody,
        });
        return result.body;
    }

}