import { ObjectId, OptionsBase, OptionsWithRql, PagedResultWithPager } from '../types';

export * from './users/types';

export interface NotificationV2Creation<T extends Record<string, string> = Record<string, string>> {
  targetUserId: ObjectId;
  title: string;
  body: string;
  data?: T;

  /**
   * See https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#AndroidConfig
   */
  android?: any;

  /**
   * See https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#ApnsConfig
   */
  apns?: any;

  /**
   * See https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#WebpushConfig
   */
  webpush?: any;
}

export interface NotificationV2<T extends Record<string, string> = Record<string, string>> extends NotificationV2Creation<T> {
  id: ObjectId;
  creatorId: ObjectId;

  /**
   * Indicates whether we tried to send the notification.
   * Would be `false` if no devices with FCM tokens were found for the user.
   * See `errors` for any errors that occurred.
   */
  sent: boolean;

  /**
   * The errors that occurred while sending the notification, if any.
   */
  errors?: NotificationV2Error[];

  creationTimestamp: Date;
  updateTimestamp: Date;
}

export interface NotificationV2Error {
  /**
   * The name of the device for which the error occurred.
   * If not set, the error occurred for the FCM token defined on the root of the user settings.
   */
  deviceName?: string;

  exhError: {
    code: string;
    name: string;
    message: string;
  };

  /**
   * The error received from FCM, unchanged, if available.
   * @example
   * {
   *   "error": {
   *     "code": 403,
   *     "message": "SenderId mismatch",
   *     "status": "PERMISSION_DENIED",
   *     "details": [
   *       {
   *         "@type": "type.googleapis.com/google.firebase.fcm.v1.FcmError",
   *         "errorCode": "SENDER_ID_MISMATCH",
   *       }
   *     ]
   *   }
   * }
   * */
  fcmError?: any;
}

export interface NotificationV2Service {
  /**
   * # Create a notification
   *
   * Creates a notification and, if FCM tokens are available for the target user, sends it to the user.
   *
   * If an unusable FCM token is detected, the request will still succeed, but the token will be removed from the user's settings.
   * Any unusable FCM token errors will be included in the `errors` field of the response.
   *
   * When sending to multiple devices, multiple errors may occur.
   * If any `FirebaseConnectionError` is encountered, that error will be thrown.
   * If no `FirebaseConnectionError` occurs but a `FirebaseInvalidPlatformDataError` is encountered, that error will be thrown instead.
   * Both error types will include a `notificationId` and an `errors` field with details about any errors that occured.
   *
   * ## Access via permissions
   * Permission | Scopes | Effect
   * - | - | -
   * `CREATE_NOTIFICATIONS` | `global` | Create notifications for any user
   * `CREATE_NOTIFICATIONS` | `group` | Create notifications for any patient in a group
   * none | | Create notifications for yourself
   *
   * # Interface
   * @param requestBody
   * @param options
   * @returns NotificationV2<T>
   *
   * @throws {FirebaseInvalidPlatformDataError} if FCM reports invalid values for `android`, `apns`, or `webpush`.
   * @throws {FirebaseConnectionError} if FCM is unreachable or returns an unknown error.
   */
  create<T extends Record<string, string>>(requestBody: NotificationV2Creation<T>, options?: OptionsBase): Promise<NotificationV2<T>>;

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
   * @param targetUserId the user id to search for
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
