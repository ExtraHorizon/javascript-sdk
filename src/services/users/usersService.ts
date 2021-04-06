import type { HttpInstance } from '../../types';
import type { UserData } from './types';

export default (userClient, httpWithAuth: HttpInstance) => ({
  
  /**
   * Retrieve the current logged in user
   * @permission Everyone can use this endpoint
   * @returns {UserData} UserData
   */
   async me(): Promise<Partial<UserData>> {
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
  async findById(userId: string): Promise<Partial<UserData>> {
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
    userData: Pick<
      UserData,
      'firstName' | 'lastName' | 'phoneNumber' | 'language' | 'timeZone'
    >
  ): Promise<UserData> {
    return (await userClient.put(httpWithAuth, `/${userId}`, userData)).data;
  }

})
