import { ObjectId, OptionsBase } from '../../types';

export interface NotificationV2UserUpsert {
  fcmToken: string;
}

export interface NotificationV2User extends NotificationV2UserUpsert {
  id: ObjectId;
  creationTimestamp: Date;
  updateTimestamp: Date;
}

export interface NotificationV2UserService {
  /**
   * # Upsert a users notification settings
   *
   * Creates a user settings object if non exists for the specified user id.
   *
   * ## Access via permissions
   * Permission | Scopes | Effect
   * - | - | -
   * `UPDATE_NOTIFICATION_SETTINGS` | `global` | Update the notification settings of any user
   * none | | Update your own notification settings
   *
   * # Interface
   * @param requestBody
   * @param options
   * @returns NotificationV2User
   */
  create(userId: ObjectId, requestBody: NotificationV2UserUpsert, options?: OptionsBase): Promise<NotificationV2User>;
}
