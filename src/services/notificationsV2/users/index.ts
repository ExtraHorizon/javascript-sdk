import { AuthHttpClient } from '../../../types';
import { HttpClient } from '../../http-client';
import { NotificationV2UserService } from './types';

export default (client: HttpClient, httpWithAuth: AuthHttpClient): NotificationV2UserService => ({
  async create(userId, requestBody, options) {
    const result = await client.put(httpWithAuth, `/users/${userId}`, requestBody, options);
    return result.data;
  },
});
