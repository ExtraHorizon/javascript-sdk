import { FindAllIterator } from '../../services/helpers';
import {
  AffectedRecords,
  ObjectId,
  OptionsBase,
  OptionsWithRql,
  PagedResult,
  PagedResultWithPager,
} from '../types';

export interface Notification {
  id: ObjectId;
  type?: string;
  viewed?: boolean;
  userId: ObjectId;
  fields?: Record<string, string>;
  important?: boolean;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}

interface CreateNotificationRequestBase {
  userId?: ObjectId;
  important?: boolean;
}

interface CreateNotificationRequestMessage
  extends CreateNotificationRequestBase {
  type: 'message';
  fields: {
    title: string;
    body: string;
  };
}

interface CreateNotificationRequestLink extends CreateNotificationRequestBase {
  type: 'link';
  fields: {
    title: string;
    body: string;
    url: string;
  };
}

interface CreateNotificationRequestMeasurementComment
  extends CreateNotificationRequestBase {
  type: 'measurement_comment';
  fields: {
    commenterId: ObjectId;
    measurementId: ObjectId;
  };
}

interface CreateNotificationRequestMeasurementReviewed
  extends CreateNotificationRequestBase {
  type: 'measurement_reviewed';
  fields: {
    measurementId: ObjectId;
  };
}

interface CreateNotificationRequestMeasurementPrescriptionExpiry
  extends CreateNotificationRequestBase {
  type: 'prescription_expiry';
  fields: {
    groupId: ObjectId;
    groupName: string;
  };
}

interface CreateNotificationRequestActivated
  extends CreateNotificationRequestBase {
  type: 'activated';
}

interface CreateNotificationRequestPasswordChanged
  extends CreateNotificationRequestBase {
  type: 'password_changed';
}

export type CreateNotificationRequest =
  | CreateNotificationRequestMessage
  | CreateNotificationRequestLink
  | CreateNotificationRequestMeasurementComment
  | CreateNotificationRequestMeasurementReviewed
  | CreateNotificationRequestMeasurementPrescriptionExpiry
  | CreateNotificationRequestActivated
  | CreateNotificationRequestPasswordChanged;

export interface NotifTypeDef {
  name?: string;
  requiredFields?: Record<string, FieldType>;
  optionalFields?: Record<
    string,
    {
      fieldType?: FieldType;
      defaultValue?: string;
    }
  >;
  title?: string;
  body?: string;
  combinedBody?: string;
  pushByDefault?: boolean;
}

export enum FieldType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  OBJECT_ID = 'OBJECT_ID',
  URL = 'URL',
}

export interface Setting {
  id?: ObjectId;
  key?: string;
  preferences?: Record<string, boolean>;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}

export type SettingCreation = Required<Pick<Setting, 'key' | 'preferences'>>;

export interface NotificationsService {
  /**
   * Create a notification
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Create a notification for yourself
   * `CREATE_NOTIFICATIONS` | `global` | Create a notification for another person
   * @param requestBody CreateNotificationRequest
   * @returns Notification
   */
  create(
    requestBody: CreateNotificationRequest,
    options?: OptionsBase
  ): Promise<Notification>;
  /**
   * Retrieve a list of notifications
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | View your own notifications
   * `VIEW_NOTIFICATIONS` | `global` | View all notifications
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Notification>
   */
  find(options?: OptionsWithRql): Promise<PagedResultWithPager<Notification>>;
  /**
   * Request a list of all notifications
   *
   * Do not pass in an rql with limit operator!
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | View your own notifications
   * `VIEW_NOTIFICATIONS` | `global` | View all notifications
   * @returns Notification[]
   */
  findAll(options?: OptionsWithRql): Promise<Notification[]>;
  /**
   * Request a list of all notifications
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | View your own notifications
   * `VIEW_NOTIFICATIONS` | `global` | View all notifications
   * @returns Notification[]
   */
  findAllIterator(options?: OptionsWithRql): FindAllIterator<Notification>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findById(id: ObjectId, options?: OptionsWithRql): Promise<Notification>;
  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(options?: OptionsWithRql): Promise<Notification>;
  /**
   * Delete notification(s)
   *
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_NOTIFICATIONS` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @returns AffectedRecords
   */
  remove(options?: OptionsWithRql): Promise<AffectedRecords>;
  /**
   * Mark your notification(s) as viewed
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @param rql Add filters to the requested list.
   * @returns AffectedRecords
   */
  markAsViewed(options?: OptionsWithRql): Promise<AffectedRecords>;
  /**
   * Retrieve the list of notification types
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @returns PagedResult<NotifTypeDef>
   */
  getTypes(options?: OptionsBase): Promise<PagedResult<NotifTypeDef>>;
}

export interface NotificationSettingsServices {
  /**
   * Retrieve a list of notifications settings
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | View your own notification settings
   * `VIEW_NOTIFICATION_SETTINGS` | `global` | View all notification settings
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Setting>
   */
  find(options?: OptionsWithRql): Promise<PagedResult<Setting>>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findById(id: ObjectId, options?: OptionsWithRql): Promise<Setting>;
  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(options?: OptionsWithRql): Promise<Setting>;
  /**
   * Update the notification settings for a user
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Update your own notification settings
   * `UPDATE_NOTIFICATION_SETTINGS` | `global` | Update all notification settings
   * @param userId The User Id
   * @param requestBody SettingCreation object
   * @returns Setting
   */
  update(
    userId: string,
    requestBody: SettingCreation,
    options?: OptionsBase
  ): Promise<Setting>;
  /**
   * Delete the notifications settings for a user
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_NOTIFICATION_SETTINGS` | `global` | **Required** for this endpoint
   * @param userId
   * @returns AffectedRecords
   */
  remove(userId: string, options?: OptionsBase): Promise<AffectedRecords>;
}
