import type { UserData } from './models';
import { HttpClientWrapper } from '../http-client';

export default (http: HttpClientWrapper): Record<string, any> => ({

  /**
   * Retrieve the current logged in user
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @returns {UserData} UserData
   * @throws ApiError
   */
  async me(): Promise<Partial<UserData>> {
    return http.get('/me');
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
  async findById(userId: string): Promise<Partial<UserData>> {
    return http.get(`/${userId}`);
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
    userData: Pick<
      UserData,
      'firstName' | 'lastName' | 'phoneNumber' | 'language' | 'timeZone'
    >
  ): Promise<UserData> {
    return http.put(`/${userId}`, userData);
  },

});
