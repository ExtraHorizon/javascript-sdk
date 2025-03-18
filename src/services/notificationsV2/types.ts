import { ObjectId, OptionsBase, OptionsWithRql, PagedResultWithPager } from '../types';

export interface NotificationV2<T extends Record<string, string> = Record<string, string>> {
  id: ObjectId;
  creatorId: ObjectId;
  targetUserId: ObjectId;
  title: string;
  body: string;
  data?: T;
  sent: boolean;
  creationTimestamp: Date;
  updateTimestamp: Date;
}

export interface NotificationV2Service {
  /**
   * # Request a list of notifications
   *
   * ## Access via permissions
   * Permission | Scopes | Effect
   * - | - | -
   * `VIEW_NOTIFICATIONS` | `global` | View all notifications
   *
   * # Interface
   * @returns PagedResultWithPager<NotificationV2<T>>
   */
  find<T extends Record<string, string>>(options?: OptionsWithRql): Promise<PagedResultWithPager<NotificationV2<T>>>;

  /**
   * # Request a list of notifications
   *
   * Do not pass in an rql with limit operator!
   *
   * ## Access via permissions
   * Permission | Scopes | Effect
   * - | - | -
   * `VIEW_NOTIFICATIONS` | `global` | View all notifications
   *
   * # Interface
   * @returns NotificationV2<T>[]
   */
  findAll<T extends Record<string, string>>(options?: OptionsWithRql): Promise<NotificationV2<T>[]>;

  /**
   * # Request a list of notifications created for a user
   *
   * ## Access via permissions
   * Permission | Scopes | Effect
   * - | - | -
   * `VIEW_NOTIFICATIONS` | `global` | View all notifications
   *
   * # Interface
   * @param targetUserId the Id to search for
   * @returns PagedResultWithPager<NotificationV2<T>>
   */
  findByTargetUserId<T extends Record<string, string>>
    (targetUserId: ObjectId, options?: OptionsWithRql): Promise<PagedResultWithPager<NotificationV2<T>>>;

  /**
   * # Request the first notification found
   *
   * ## Access via permissions
   * Permission | Scopes | Effect
   * - | - | -
   * `VIEW_NOTIFICATIONS` | `global` | View all notifications
   *
   * # Interface
   * @returns NotificationV2<T> | undefined
   */
  findFirst<T extends Record<string, string>>(options?: OptionsWithRql): Promise<NotificationV2<T> | undefined>;

  /**
   * # Request a notification by id
   *
   * ## Access via permissions
   * Permission | Scopes | Effect
   * - | - | -
   * `VIEW_NOTIFICATIONS` | `global` | View all notifications
   *
   * # Interface
   * @param notificationId the Id to search for
   * @returns NotificationV2<T> | undefined
   */
  findById<T extends Record<string, string>>
    (notificationId: ObjectId, options?: OptionsBase): Promise<NotificationV2<T> | undefined>;
}
