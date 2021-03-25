/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FullUser } from '../models/FullUser';
import type { HashBean } from '../models/HashBean';
import type { LanguageCode } from '../models/LanguageCode';
import type { ObjectId } from '../models/ObjectId';
import type { PagedResult } from '../models/PagedResult';
import type { Patient } from '../models/Patient';
import type { StaffMember } from '../models/StaffMember';
import type { TimeZone } from '../models/TimeZone';
import { request as __request } from '../core/request';

export class UsersService {

    /**
     * Retrieve a list of users
     * Permission | Scope | Effect
     * - | - | -
     * none | `patient enlistment` | See a limited set of fields of the staff members (of the groups where you are enlisted as a patient)
     * none | `staff enlistment` | See a limited set of fields of all patients and staff members (of the groups where you are enlisted as staff member)
     * `VIEW_USER` | `global` | See all fields of all users
     *
     * @param rql Add filters to the requested list.
     * @returns any Success
     * @throws ApiError
     */
    public static async getUsersService(
        rql?: string,
    ): Promise<(PagedResult & {
        data?: Array<FullUser>,
    })> {
        const result = await __request({
            method: 'GET',
            path: `/`,
            query: {
                'RQL': rql,
            },
        });
        return result.body;
    }

    /**
     * @deprecated
     * Delete a list of users
     * Permission | Scope | Effect
     * - | - | -
     * none | | Delete your own user (object)
     * `DELETE_USER` | `global` | Delete any user
     *
     * @param rql Add filters to the requested list.
     * @returns any Operation successful
     * @throws ApiError
     */
    public static async deleteUsersService(
        rql: string,
    ): Promise<{
        records_affected?: number,
    }> {
        const result = await __request({
            method: 'DELETE',
            path: `/`,
            query: {
                'RQL': rql,
            },
        });
        return result.body;
    }

    /**
     * Retrieve the current logged in user
     * Permission | Scope | Effect
     * - | - | -
     * none |  | Everyone can use this endpoint
     *
     * @returns FullUser Success
     * @throws ApiError
     */
    public static async getUsersService1(): Promise<FullUser> {
        const result = await __request({
            method: 'GET',
            path: `/me`,
        });
        return result.body;
    }

    /**
     * Retrieve a list of users that have a patient enlistment
     * Permission | Scope | Effect
     * - | - | -
     * none | `staff enlistment` | View the patients of the group
     * `VIEW_PATIENTS` | `global`  | View all patients
     *
     * @param rql Add filters to the requested list.
     * @returns Patient Success
     * @throws ApiError
     */
    public static async getUsersService2(
        rql?: string,
    ): Promise<Array<Patient>> {
        const result = await __request({
            method: 'GET',
            path: `/patients`,
            query: {
                'RQL': rql,
            },
        });
        return result.body;
    }

    /**
     * Retrieve a list of users that have a staff enlistment
     * Permission | Scope | Effect
     * - | - | -
     * none | `staff enlistment` | View the other staff members of the group
     * `VIEW_STAFF` | `global`  | View all staff members
     *
     * @param rql Add filters to the requested list.
     * @returns StaffMember Success
     * @throws ApiError
     */
    public static async getUsersService3(
        rql?: string,
    ): Promise<Array<StaffMember>> {
        const result = await __request({
            method: 'GET',
            path: `/staff`,
            query: {
                'RQL': rql,
            },
        });
        return result.body;
    }

    /**
     * Retrieve a specific user
     * Permission | Scope | Effect
     * - | - | -
     * none | | See your own user object
     * none | `group` | See a subset of the fields for any staff member or patient of the group
     * `VIEW_PATIENTS` | `global` | See a subset of fields for any user with a patient enlistment
     * `VIEW_STAFF` | `global` | See a subset of fields for any user with a staff enlistment
     * `VIEW_USER` | `global` | See any user object
     *
     * @param userId Id of the targeted user
     * @returns FullUser Success
     * @throws ApiError
     */
    public static async getUsersService4(
        userId: ObjectId,
    ): Promise<FullUser> {
        const result = await __request({
            method: 'GET',
            path: `/${userId}`,
            errors: {
                404: `Error response`,
            },
        });
        return result.body;
    }

    /**
     * Update a specific user
     * Permission | Scope | Effect
     * - | - | -
     * none | | Update your own data
     * `UPDATE_USER` | `global` | Update any user
     *
     * @param userId Id of the targeted user
     * @param requestBody
     * @returns FullUser Success
     * @throws ApiError
     */
    public static async putUsersService(
        userId: ObjectId,
        requestBody?: {
            first_name?: string,
            last_name?: string,
            phone_number?: string,
            language?: LanguageCode,
            time_zone?: TimeZone,
        },
    ): Promise<FullUser> {
        const result = await __request({
            method: 'PUT',
            path: `/${userId}`,
            body: requestBody,
            errors: {
                404: `Error response`,
            },
        });
        return result.body;
    }

    /**
     * Delete a specific user
     * Permission | Scope | Effect
     * - | - | -
     * none | | Delete your own user object
     * `DELETE_USER` | `global` | Delete any user
     *
     * @param userId Id of the targeted user
     * @returns any Operation successful
     * @throws ApiError
     */
    public static async deleteUsersService1(
        userId: ObjectId,
    ): Promise<{
        records_affected?: number,
    }> {
        const result = await __request({
            method: 'DELETE',
            path: `/${userId}`,
            errors: {
                404: `Error response`,
            },
        });
        return result.body;
    }

    /**
     * Update the email address of a specific user
     * An email is send to validate and activate the new address.
     *
     * Permission | Scope | Effect
     * - | - | -
     * none | | Update your own data
     * `UPDATE_USER_EMAIL` | `global` | Update any user
     *
     * @param userId Id of the targeted user
     * @param requestBody
     * @returns FullUser Success
     * @throws ApiError
     */
    public static async putUsersService1(
        userId: ObjectId,
        requestBody?: {
            email: string,
        },
    ): Promise<FullUser> {
        const result = await __request({
            method: 'PUT',
            path: `/${userId}/email`,
            body: requestBody,
            errors: {
                400: `Error response`,
                404: `Error response`,
            },
        });
        return result.body;
    }

    /**
     * Add a patient enlistment to a user
     * Permission | Scope | Effect
     * - | - | -
     * `ADD_PATIENT` | `global` | **Required** for this endpoint
     *
     * @param userId Id of the targeted user
     * @param requestBody
     * @returns any Operation successful
     * @throws ApiError
     */
    public static async postUsersService(
        userId: ObjectId,
        requestBody?: {
            group_id: ObjectId,
            expiry_timestamp?: number,
        },
    ): Promise<{
        records_affected?: number,
    }> {
        const result = await __request({
            method: 'POST',
            path: `/${userId}/patient_enlistments/`,
            body: requestBody,
            errors: {
                400: `Error response`,
            },
        });
        return result.body;
    }

    /**
     * Remove a patient enlistment from a user
     * Permission | Scope | Effect
     * - | - | -
     * none | | Remove a patient enlistment from yourself
     * `REMOVE_PATIENT` | `staff enlistment` | Remove a patient enlistment for the group
     * `REMOVE_PATIENT` | `global` | Remove any patient enlistment
     *
     * @param userId Id of the targeted user
     * @param groupId Id of the targeted group
     * @returns any Operation successful
     * @throws ApiError
     */
    public static async deleteUsersService2(
        userId: ObjectId,
        groupId: ObjectId,
    ): Promise<{
        records_affected?: number,
    }> {
        const result = await __request({
            method: 'DELETE',
            path: `/${userId}/patient_enlistments/${groupId}`,
            errors: {
                404: `Error response`,
            },
        });
        return result.body;
    }

    /**
     * Create an account
     * Permission | Scope | Effect
     * - | - | -
     * none | | Everyone can use this endpoint
     *
     * @param requestBody
     * @returns FullUser Success
     * @throws ApiError
     */
    public static async postUsersService1(
        requestBody?: {
            first_name: string,
            last_name: string,
            email: string,
            password: string,
            phone_number?: string,
            birthday: string,
            gender: number,
            country: string,
            region?: string,
            language: LanguageCode,
            time_zone?: TimeZone,
        },
    ): Promise<FullUser> {
        const result = await __request({
            method: 'POST',
            path: `/register`,
            body: requestBody,
            errors: {
                400: `Error response`,
            },
        });
        return result.body;
    }

    /**
     * Change your password
     * Permission | Scope | Effect
     * - | - | -
     * none |  | Everyone can use this endpoint
     *
     * @param requestBody
     * @returns FullUser Success
     * @throws ApiError
     */
    public static async putUsersService2(
        requestBody?: {
            old_password: string,
            new_password: string,
        },
    ): Promise<FullUser> {
        const result = await __request({
            method: 'PUT',
            path: `/password`,
            body: requestBody,
            errors: {
                400: `Error response`,
            },
        });
        return result.body;
    }

    /**
     * Authenticate a user
     * Permission | Scope | Effect
     * - | - | -
     * none |  | Everyone can use this endpoint
     *
     * @param requestBody
     * @returns FullUser Success
     * @throws ApiError
     */
    public static async postUsersService2(
        requestBody?: {
            email: string,
            password: string,
        },
    ): Promise<FullUser> {
        const result = await __request({
            method: 'POST',
            path: `/authenticate`,
            body: requestBody,
            errors: {
                401: `Error response`,
            },
        });
        return result.body;
    }

    /**
     * Request an email activation
     * Permission | Scope | Effect
     * - | - | -
     * none |  | Everyone can use this endpoint
     *
     * @param email
     * @returns any Success
     * @throws ApiError
     */
    public static async getUsersService5(
        email: string,
    ): Promise<any> {
        const result = await __request({
            method: 'GET',
            path: `/activation`,
            query: {
                'email': email,
            },
            errors: {
                400: `Error response`,
            },
        });
        return result.body;
    }

    /**
     * Complete an email activation
     * Permission | Scope | Effect
     * - | - | -
     * none |  | Everyone can use this endpoint
     *
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static async postUsersService3(
        requestBody?: HashBean,
    ): Promise<any> {
        const result = await __request({
            method: 'POST',
            path: `/activation`,
            body: requestBody,
            errors: {
                400: `Error response`,
            },
        });
        return result.body;
    }

    /**
     * Request a password reset
     * Permission | Scope | Effect
     * - | - | -
     * none |  | Everyone can use this endpoint
     *
     * @param email
     * @returns any Success
     * @throws ApiError
     */
    public static async getUsersService6(
        email: string,
    ): Promise<any> {
        const result = await __request({
            method: 'GET',
            path: `/forgot_password`,
            query: {
                'email': email,
            },
            errors: {
                400: `Error response`,
            },
        });
        return result.body;
    }

    /**
     * Complete a password reset
     * Permission | Scope | Effect
     * - | - | -
     * none |  | Everyone can use this endpoint
     *
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static async postUsersService4(
        requestBody?: {
            hash?: string,
            new_password: string,
        },
    ): Promise<any> {
        const result = await __request({
            method: 'POST',
            path: `/forgot_password`,
            body: requestBody,
            errors: {
                400: `Error response`,
            },
        });
        return result.body;
    }

    /**
     * Confirm the password for the user making the request
     * Permission | Scope | Effect
     * - | - | -
     * none |  | Everyone can use this endpoint
     *
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static async postUsersService5(
        requestBody?: {
            password: string,
        },
    ): Promise<any> {
        const result = await __request({
            method: 'POST',
            path: `/confirm_password`,
            body: requestBody,
            errors: {
                401: `Error response`,
            },
        });
        return result.body;
    }

    /**
     * Check if an email address is still available
     * Permission | Scope | Effect
     * - | - | -
     * none | | Everyone can use this endpoint
     *
     * @param email
     * @returns any Success
     * @throws ApiError
     */
    public static async getUsersService7(
        email: string,
    ): Promise<{
        email_available?: boolean,
    }> {
        const result = await __request({
            method: 'GET',
            path: `/email_available`,
            query: {
                'email': email,
            },
        });
        return result.body;
    }

    /**
     * Update the profile image of a user
     * Permission | Scope | Effect
     * - | - | -
     * none | | Update your own profile image
     * `UPDATE_PROFILE_IMAGE` | `global` | Update any user its profile image
     *
     * @param userId Id of the targeted user
     * @param requestBody
     * @returns FullUser Success
     * @throws ApiError
     */
    public static async putUsersService3(
        userId: ObjectId,
        requestBody?: HashBean,
    ): Promise<FullUser> {
        const result = await __request({
            method: 'PUT',
            path: `/${userId}/profile_image`,
            body: requestBody,
            errors: {
                404: `Error response`,
            },
        });
        return result.body;
    }

    /**
     * Delete the profile image of a user
     * Permission | Scope | Effect
     * - | - | -
     * none | | Delete your own profile image
     * `UPDATE_PROFILE_IMAGE` | `global` | Delete any user its profile image
     *
     * @param userId Id of the targeted user
     * @returns FullUser Success
     * @throws ApiError
     */
    public static async deleteUsersService3(
        userId: ObjectId,
    ): Promise<FullUser> {
        const result = await __request({
            method: 'DELETE',
            path: `/${userId}/profile_image`,
            errors: {
                404: `Error response`,
            },
        });
        return result.body;
    }

}