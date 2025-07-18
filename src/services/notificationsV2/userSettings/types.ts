import { AffectedRecords, ObjectId, OptionsBase, OptionsWithRql, PagedResultWithPager } from '../../types';

export interface NotificationV2UserSettingsUpsert {
  /** @deprecated We recommend using `devices` instead */
  fcmToken: string | null;
}

export interface NotificationV2UserSettings extends NotificationV2UserSettingsUpsert {
  id: ObjectId;
  devices?: NotificationV2UserDevice[];
  creationTimestamp: Date;
  updateTimestamp: Date;
}

export interface NotificationV2UserDeviceUpsert {
  description?: string | null;
  fcmToken?: string | null;
}

export interface NotificationV2UserDevice {
  name: string;
  description?: string;
  fcmToken?: string;
  creationTimestamp: Date;
  updateTimestamp: Date;
}

export interface NotificationV2UserSettingsService {
  /**
   * # Get the notification settings for a specific user
   *
   * This will always return a notification settings object, even if the user does not have any notification settings set up.
   *
   * ## Access via permissions
   * Permission | Scopes | Effect
   * - | - | -
   * `VIEW_NOTIFICATION_SETTINGS` | `global` | View all notifications
   * none | | View your own notification settings
   */
  getById(userId: ObjectId, options?: OptionsBase): Promise<NotificationV2UserSettings>;

  /**
   * @deprecated We recommend using `devices` instead, managed by the `addOrUpdateDevice()` and `removeDevice()` methods.
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
   * ## Interface
   * @param requestBody
   * @param options
   * @returns AffectedRecords
   */
  update(userId: ObjectId, requestBody: NotificationV2UserSettingsUpsert, options?: OptionsBase): Promise<AffectedRecords>;

  /**
   * # Delete the notification settings for a specific user
   *
   * ## Access via permissions
   * Permission | Scopes | Effect
   * - | - | -
   * `DELETE_NOTIFICATION_SETTINGS` | `global` | Delete the notification settings of any user
   * none | | Delete your own notification settings
   *
   * ## Interface
   * @throws {ResourceUnknownError} when notification settings for the specified user do not exist
   */
  remove(userId: ObjectId, options?: OptionsBase): Promise<AffectedRecords>;

  /**
   * # Add or update a device for the notification settings of a user
   *
   * Create or update the device with the specified name for the user with the given Id.
   *
   * If the user already has a device with the specified name, it will be updated.
   *
   * If the user does not have a device with the specified name, it will be created.
   *
   * If the user does not have user settings, it will be created.
   *
   * Setting `null` for `fcmToken` or `description` will remove the configured value.
   *
   * ## Access via permissions
   * Permission | Scopes | Effect
   * - | - | -
   * `UPDATE_NOTIFICATION_SETTINGS_DEVICE` | `global` | Update devices for notification settings of any user
   * none | | Update devices for your own notification settings
   */
  addOrUpdateDevice(
    userId: ObjectId,
    deviceName: string,
    requestBody: NotificationV2UserDeviceUpsert,
    options?: OptionsBase
  ): Promise<AffectedRecords>;

  /**
   * # Remove a device from the notification settings of a user
   *
   * ## Access via permissions
   * Permission | Scopes | Effect
   * - | - | -
   * `DELETE_NOTIFICATION_SETTINGS_DEVICE` | `global` | Delete devices from notification settings of any user
   * none | | Delete devices from your own notification settings
   *
   * ## Interface
   * @throws {ResourceUnknownError} when specified user or device does not exist
   */
  removeDevice(userId: ObjectId, deviceName: string, options?: OptionsBase): Promise<AffectedRecords>;

  /**
  * # Request a list of user notification settings
  *
  * ## Access via permissions
  * Permission | Scopes | Effect
  * - | - | -
  * `VIEW_NOTIFICATION_SETTINGS` | `global` | View all notifications
  *
  * ## Interface
  * @returns PagedResultWithPager<NotificationV2User>
  */
  find(options?: OptionsWithRql): Promise<PagedResultWithPager<NotificationV2UserSettings>>;

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
  * ## Interface
  * @returns NotificationV2User[]
  */
  findAll(options?: OptionsWithRql): Promise<NotificationV2UserSettings[]>;

  /**
   * # Request the first user notification settings
   *
   * ## Access via permissions
   * Permission | Scopes | Effect
   * - | - | -
   * `VIEW_NOTIFICATION_SETTINGS` | `global` | View all notifications
   *
   * ## Interface
   * @returns NotificationV2User | undefined
   */
  findFirst(options?: OptionsWithRql): Promise<NotificationV2UserSettings | undefined>;
}
