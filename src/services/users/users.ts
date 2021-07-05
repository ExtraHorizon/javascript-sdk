import type { HttpInstance } from '../../types';
import { ObjectId, Results, AffectedRecords, PagedResult } from '../types';
import type {
  RegisterUserData,
  User,
  UserDataUpdate,
  Email,
  AddPatientEnlistment,
  ChangePassword,
  Authenticate,
  PasswordReset,
  ConfirmPassword,
  Patient,
  StaffMember,
  Hash,
  UsersService,
} from './types';
import type { RQLString } from '../../rql';

export default (userClient, httpWithAuth: HttpInstance): UsersService => ({
  /**
   * Retrieve the current logged in user
   * @permission Everyone can use this endpoint
   * @returns {UserData} UserData
   */
  async me(): Promise<User> {
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
  async findById(userId: string): Promise<User> {
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
  async update(userId: string, userData: UserDataUpdate): Promise<User> {
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
   * @returns PagedResult<User>
   */
  async find(options?: { rql?: RQLString }): Promise<PagedResult<User>> {
    return (await userClient.get(httpWithAuth, `/${options?.rql || ''}`)).data;
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
   */
  async removeUsers(rql: RQLString): Promise<AffectedRecords> {
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
   */
  async patients(options?: { rql?: RQLString }): Promise<PagedResult<Patient>> {
    return (
      await userClient.get(httpWithAuth, `/patients${options?.rql || ''}`)
    ).data;
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
   */
  async staff(options?: {
    rql?: RQLString;
  }): Promise<PagedResult<StaffMember>> {
    return (await userClient.get(httpWithAuth, `/staff${options?.rql || ''}`))
      .data;
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
   * @throws {ResourceUnknownError}
   */
  async remove(userId: ObjectId): Promise<AffectedRecords> {
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
   * @throws {EmailUsedError}
   * @throws {ResourceUnknownError}
   */
  async updateEmail(userId: ObjectId, requestBody: Email): Promise<User> {
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
   * @throws {ResourceAlreadyExistsError}
   */
  async addPatientEnlistment(
    userId: ObjectId,
    requestBody: AddPatientEnlistment
  ): Promise<AffectedRecords> {
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
   * @throws {ResourceUnknownError}
   */
  async removePatientEnlistment(
    userId: ObjectId,
    groupId: ObjectId
  ): Promise<AffectedRecords> {
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
   * @throws {EmailUsedError}
   */
  async createAccount(requestBody: RegisterUserData): Promise<User> {
    return (await userClient.post(httpWithAuth, '/register', requestBody)).data;
  },

  /**
   * Change your password
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param requestBody
   * @returns FullUser Success
   * @throws {PasswordError}
   */
  async changePassword(requestBody: ChangePassword): Promise<User> {
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
  async authenticate(requestBody: Authenticate): Promise<User> {
    return (await userClient.post(httpWithAuth, '/authenticate', requestBody))
      .data;
  },

  /**
   * Request an email activation
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param email
   * @returns {boolean} Success
   * @throws {EmailUnknownError}
   * @throws {AlreadyActivatedError}
   */
  async requestEmailActivation(email: string): Promise<boolean> {
    return (
      (
        await userClient.get(httpWithAuth, '/activation', {
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
   * @throws {ActivationUnknownError}
   */
  async validateEmailActivation(requestBody: Hash): Promise<boolean> {
    return (
      (await userClient.post(httpWithAuth, '/activation', requestBody))
        .status === Results.Success
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
   * @throws {EmailUnknownError}
   * @throws {NotActivatedError}
   */
  async requestPasswordReset(email: string): Promise<boolean> {
    return (
      (
        await userClient.get(httpWithAuth, '/forgot_password', {
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
   * @returns true if completed a password reset
   * @throws {NotActivatedError}
   * @throws {NewPasswordHashUnknownError}
   */
  async validatePasswordReset(requestBody: PasswordReset): Promise<boolean> {
    const result = await userClient.post(
      httpWithAuth,
      '/forgot_password',
      requestBody
    );
    return result.status === Results.Success;
  },

  /**
   * Confirm the password for the user making the request
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param requestBody the password to confirm
   * @returns true if password was confirmed
   * @throws {AuthenticationError}
   * @throws {LoginTimeoutError}
   * @throws {LoginFreezeError}
   * @throws {TooManyFailedAttemptsError}
   */
  async confirmPassword(requestBody: ConfirmPassword): Promise<boolean> {
    const result = await userClient.post(
      httpWithAuth,
      '/confirm_password',
      requestBody
    );
    return result.status === Results.Success;
  },

  /**
   * Check if an email address is still available
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param email
   * @returns emailAvailable will be true on success
   */
  async isEmailAvailable(email: string): Promise<{
    emailAvailable: boolean;
  }> {
    return (
      await userClient.get(httpWithAuth, '/email_available', {
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
   * @throws {ResourceUnknownError}
   */
  async updateProfileImage(userId: ObjectId, requestBody: Hash): Promise<User> {
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
   * @throws {ResourceUnknownError}
   */
  async deleteProfileImage(userId: ObjectId): Promise<User> {
    return (await userClient.delete(httpWithAuth, `/${userId}/profile_image`))
      .data;
  },
});
