import type { HttpInstance } from '../../types';
import type {
  RegisterUserData,
  PartialUserData,
  UserDataUpdate,
  UserList,
  RecordsAffected,
  Email,
  AddPatientEnlistment,
  ChangePassword,
  Authenticate,
  PasswordReset,
  ConfirmPassword,
} from './types';
import type { ObjectId } from '../models/ObjectId';
import type { Patient } from './models/Patient';
import type { StaffMember } from './models/StaffMember';
import type { HashBean } from './models/HashBean';
import { Results } from '../models/Results';

export default (
  userClient,
  http: HttpInstance,
  httpWithAuth: HttpInstance
) => ({
  /**
   * Retrieve the current logged in user
   * @permission Everyone can use this endpoint
   * @returns {UserData} UserData
   */
  async me(): Promise<PartialUserData> {
    return (await userClient.get(httpWithAuth, '/me')).data;
  },

  /**
   * Retrieve a specific user
   * @params {string} userId of the targeted user (required)
   * @permission See your own user object
   * @permission --------- | scope:group  | See a subset of the fields for any staff member or patient of the group
   * @permission VIEW_PATIENTS | scope:global | See a subset of fields for any user with a patient enlistment
   * @permission VIEW_STAFF | scope:global | See a subset of fields for any user with a staff enlistment
   * @permission VIEW_USER | scope:global | See any user object
   * @throws {ResourceUnknownError}
   * @returns {UserData} UserData
   */
  async findById(userId: string): Promise<PartialUserData> {
    return (await userClient.get(httpWithAuth, `/${userId}`)).data;
  },

  /**
   * Update a specific user
   * @params {string} userId of the targeted user (required)
   * @params {Pick<UserData,'firstName' | 'lastName' | 'phoneNumber' | 'language' | 'timeZone'>} data Fields to update
   * @permission Update your own data
   * @permission UPDATE_USER | scope:global | Update any user
   * @throws {ResourceUnknownError}
   * @returns {UserData} UserData
   */
  async update(
    userId: string,
    userData: UserDataUpdate
  ): Promise<PartialUserData> {
    return (await userClient.put(httpWithAuth, `/${userId}`, userData)).data;
  },

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
  async find(rql = ''): Promise<UserList> {
    return (await userClient.get(httpWithAuth, `/${rql}`)).data;
  },

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
  async removeUsers(rql = ''): Promise<RecordsAffected> {
    return (await userClient.delete(httpWithAuth, `/${rql}`)).data;
  },

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
  async patients(rql = ''): Promise<Patient[]> {
    return (await userClient.get(httpWithAuth, `/patients${rql}`)).data;
  },

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
  async staff(rql = ''): Promise<StaffMember[]> {
    return (await userClient.get(httpWithAuth, `/staff${rql}`)).data;
  },

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
  async remove(userId: ObjectId): Promise<RecordsAffected> {
    return (await userClient.delete(httpWithAuth, `/${userId}`)).data;
  },

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
  async updateEmail(
    userId: ObjectId,
    requestBody?: Email
  ): Promise<PartialUserData> {
    return (await userClient.put(httpWithAuth, `/${userId}/email`, requestBody))
      .data;
  },

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
  async addPatientEnlistment(
    userId: ObjectId,
    requestBody?: AddPatientEnlistment
  ): Promise<RecordsAffected> {
    return (
      await userClient.post(
        httpWithAuth,
        `/${userId}/patient_enlistments`,
        requestBody
      )
    ).data;
  },

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
  async removePatientEnlistment(
    userId: ObjectId,
    groupId: ObjectId
  ): Promise<RecordsAffected> {
    return (
      await userClient.delete(
        httpWithAuth,
        `/${userId}/patient_enlistments/${groupId}`
      )
    ).data;
  },

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
  async createAccount(requestBody: RegisterUserData): Promise<PartialUserData> {
    return (await userClient.post(http, '/register', requestBody)).data;
  },

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
  async changePassword(requestBody: ChangePassword): Promise<PartialUserData> {
    return (await userClient.put(httpWithAuth, '/password', requestBody)).data;
  },

  /**
   * Authenticate a user
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param requestBody
   * @returns FullUser Success
   * @throws {AuthenticationError}
   * @throws {LoginTimeoutError}
   * @throws {LoginFreezeError}
   * @throws {TooManyFailedAttemptsError}
   */
  async authenticate(requestBody: Authenticate): Promise<PartialUserData> {
    return (await userClient.post(http, '/authenticate', requestBody)).data;
  },

  /**
   * Request an email activation
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param email
   * @returns {boolean} Success
   * @throws {EmailUnknownException}
   * @throws {AlreadyActivatedException}
   */
  async requestEmailActivation(email: string): Promise<boolean> {
    return (
      (
        await userClient.get(http, '/activation', {
          params: {
            email,
          },
        })
      ).status === Results.Success
    );
  },

  /**
   * Complete an email activation
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param requestBody
   * @returns {boolean} Success
   * @throws {ActivationUnknownException}
   */
  async validateEmailActivation(requestBody?: HashBean): Promise<boolean> {
    return (
      (await userClient.post(http, '/activation', requestBody)).status ===
      Results.Success
    );
  },

  /**
   * Request a password reset
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param email
   * @returns {boolean} Success
   * @throws ApiError
   */
  async requestPasswordReset(email: string): Promise<boolean> {
    return (
      (
        await userClient.get(http, '/forgot_password', {
          params: {
            email,
          },
        })
      ).status === Results.Success
    );
  },

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
  async validatePasswordReset(requestBody?: PasswordReset): Promise<boolean> {
    return (
      (await userClient.post(http, '/forgot_password', requestBody)).status ===
      Results.Success
    );
  },

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
  async confirmPassword(requestBody?: ConfirmPassword): Promise<boolean> {
    return (
      (await userClient.post(httpWithAuth, '/confirm_password', requestBody))
        .status === Results.Success
    );
  },

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
  async isEmailAvailable(
    email: string
  ): Promise<{
    emailAvailable?: boolean;
  }> {
    return (
      await userClient.get(http, '/email_available', {
        params: {
          email,
        },
      })
    ).data;
  },

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
  async updateProfileImage(
    userId: ObjectId,
    requestBody?: HashBean
  ): Promise<PartialUserData> {
    return (
      await userClient.put(
        httpWithAuth,
        `/${userId}/profile_image`,
        requestBody
      )
    ).data;
  },

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
  async deleteProfileImage(userId: ObjectId): Promise<PartialUserData> {
    return (await userClient.delete(httpWithAuth, `/${userId}/profile_image`))
      .data;
  },
});
