import HttpClient from '../../core/httpClient';
import { UserData } from './models';
import { ObjectId, LanguageCode, TimeZone } from './types';

export default class UsersService {
  private http: HttpClient;

  constructor(path: string) {
    this.http = new HttpClient(path);
  }

  /**
   * Perform a health check
   * @permission Everyone can use this endpoint
   * @returns {boolean} success
   */
  async health(): Promise<boolean> {
    return this.http.get({
      path: '/health',
      skipAuthentication: true,
    }).then(() => true).catch(() => false);
  }

  /**
   * Retrieve the current logged in user
   * @permission Everyone can use this endpoint
   * @returns {UserData} UserData
   */
  async me(): Promise<Partial<UserData>> {
    return this.http.get({
      path: '/me',
    });
  }

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
    return this.http.get({
      path: `/${userId}`,
    });
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
  async update(
    userId: ObjectId,
    requestBody?: {
        firstName?: string,
        lastName?: string,
        phoneNumber?: string,
        language?: LanguageCode,
        timeZone?: TimeZone,
    }
  ): Promise<Partial<UserData>> {
    return this.http.put({
      path: `/${userId}`,
      body: requestBody,
      decamelizeRequest: true,
    });
  }
}
