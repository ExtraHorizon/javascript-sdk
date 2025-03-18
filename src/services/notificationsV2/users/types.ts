import { ObjectId, OptionsBase, OptionsWithRql, PagedResultWithPager } from '../../types';

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
   * # Update a user its notification settings
   *
   * Updates (or creates if non exists) a user its settings for the specified user id.
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
  update(userId: ObjectId, requestBody: NotificationV2UserUpsert, options?: OptionsBase): Promise<NotificationV2User>;

  /**
  * # Request a list of user notification settings
  *
  * ## Access via permissions
  * Permission | Scopes | Effect
  * - | - | -
  * `VIEW_NOTIFICATION_SETTINGS` | `global` | View all notifications
  *
  * # Interface
  * @returns PagedResultWithPager<NotificationV2User>
  */
  find(options?: OptionsWithRql): Promise<PagedResultWithPager<NotificationV2User>>;

  /**
  * # Request a list of user notification settings
  *
  * Do not pass in an rql with limit operator!
  *
  * ## Access via permissions
  * Permission | Scopes | Effect
  * - | - | -
  * `VIEW_NOTIFICATION_SETTINGS` | `global` | View all notifications
  *
  * # Interface
  * @returns NotificationV2User[]
  */
  findAll(options?: OptionsWithRql): Promise<NotificationV2User[]>;

  /**
  * # Request notification settings for a specific user
  *
  * ## Access via permissions
  * Permission | Scopes | Effect
  * - | - | -
  * `VIEW_NOTIFICATION_SETTINGS` | `global` | View all notifications
  *
  * # Interface
  * @param userId the user id to search for
  * @returns NotificationV2User | undefined
  */
  findByUserId(userId: ObjectId, options?: OptionsWithRql): Promise<NotificationV2User | undefined>;

  /**
   * # Request the first user notification settings
   *
   * ## Access via permissions
   * Permission | Scopes | Effect
   * - | - | -
   * `VIEW_NOTIFICATION_SETTINGS` | `global` | View all notifications
   *
   * # Interface
   * @returns NotificationV2User | undefined
   */
  findFirst(options?: OptionsWithRql): Promise<NotificationV2User | undefined>;
}
