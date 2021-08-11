import {
  Entity,
  Timestamps,
  ObjectId,
  AffectedRecords,
  OptionsBase,
  OptionsWithRql,
} from '../types';

export type Configuration = Record<string, any>;

export interface GeneralConfigurationInput {
  data?: Configuration;
  userConfiguration?: Configuration;
  groupConfiguration?: Configuration;
  staffConfiguration?: Configuration;
  patientConfiguration?: Configuration;
}

export type GeneralConfiguration = GeneralConfigurationInput &
  Entity &
  Timestamps;

export interface GroupConfigurationInput {
  data?: Configuration;
  staffConfiguration?: Configuration;
  patientConfiguration?: Configuration;
}

export type GroupConfiguration = GroupConfigurationInput & Entity & Timestamps;

export interface UserConfigurationInput {
  data?: Configuration;
}

export interface UserEnlistments {
  staffConfigurations?: Array<EnlistmentConfiguration>;
  patientConfigurations?: Array<EnlistmentConfiguration>;
}

export interface EnlistmentConfiguration {
  groupId?: ObjectId;
  data?: Configuration;
}

export type UserConfiguration = UserConfigurationInput &
  UserEnlistments &
  Entity &
  Timestamps;

export interface ConfigurationsGeneralService {
  /**
   * View the general configuration.
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @returns GeneralConfiguration
   */
  get(options?: OptionsBase): Promise<GeneralConfiguration>;
  /**
   * Update the general configuration
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_CONFIGURATIONS` | `global` | Required for this endpoint
   * @param requestBody GeneralConfigurationInput
   * @param rql Add filters to the requested list.
   * @returns AffectedRecords
   */
  update(
    requestBody: GeneralConfigurationInput,
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
  /**
   * Delete fields from the general configuration.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_CONFIGURATIONS` | `global` | Required for this endpoint
   * @param requestBody list of fields to remove
   * @param rql Add filters to the requested list.
   * @returns AffectedRecords
   */
  removeFields(
    requestBody: {
      fields: Array<string>;
    },
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
}

export interface ConfigurationsGroupsService {
  /**
   * View a group configuration
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_PATIENT_CONFIGURATIONS` | `staff enlistment` | View the group its patient configuration
   * `VIEW_STAFF_CONFIGURATIONS` | `staff enlistment` | View the group its staff configuration
   * `VIEW_CONFIGURATIONS` | `staff enlistment` | View the group its full configuration
   * `VIEW_CONFIGURATIONS` | `global` | View any group its full configuration
   * @param groupId The id of the targeted group
   * @returns GroupConfiguration
   */
  get(groupId: ObjectId, options?: OptionsBase): Promise<GroupConfiguration>;
  /**
   * Update a group configuration.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_PATIENT_CONFIGURATIONS` | `staff enlistment` | Update the group its patient configuration
   * `UPDATE_STAFF_CONFIGURATIONS` | `staff enlistment` | Update the group its staff configuration
   * `UPDATE_CONFIGURATIONS` | `staff enlistment` | Update the group its full configuration
   * `UPDATE_CONFIGURATIONS` | `global` | Update any group its full configuration
   * @param groupId The id of the targeted group
   * @param requestBody GroupConfigurationInput
   * @param rql Add filters to the requested list.
   * @returns AffectedRecords
   */
  update(
    groupId: ObjectId,
    requestBody: GroupConfigurationInput,
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
  /**
   * Delete fields from a group configuration.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_PATIENT_CONFIGURATIONS` | `staff enlistment` | Update the group its patient configuration
   * `UPDATE_STAFF_CONFIGURATIONS` | `staff enlistment` | Update the group its staff configuration
   * `UPDATE_CONFIGURATIONS` | `staff enlistment` | Update the group its full configuration
   * `UPDATE_CONFIGURATIONS` | `global` | Update any group its full configuration
   * @param groupId The id of the targeted group
   * @param requestBody the list of fields to remove
   * @param rql Add filters to the requested list.
   * @returns AffectedRecords
   */
  removeFields(
    groupId: ObjectId,
    requestBody: {
      fields: Array<string>;
    },
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
}

export interface ConfigurationsPatientsService {
  /**
   * Update a patient configuration for a group of a user.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_PATIENT_CONFIGURATIONS` | `staff enlistment` | For patients of the group, update the patient enlistment configuration of the group
   * `UPDATE_CONFIGURATIONS` | `staff enlistment` | For patients of the group, update the patient enlistment configuration of the group
   * `UPDATE_CONFIGURATIONS` | `global` | Update any user its staff configuration
   * @param groupId The id of the targeted group
   * @param userId The id of the targeted user
   * @param requestBody UserConfigurationInput
   * @returns AffectedRecords
   */
  update(
    groupId: ObjectId,
    userId: ObjectId,
    requestBody: UserConfigurationInput,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Delete fields from a patient configuration for a group of a user.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_PATIENT_CONFIGURATIONS` | `staff enlistment` | For patients of the group, update the patient enlistment configuration of the group
   * `UPDATE_CONFIGURATIONS` | `staff enlistment` | For patients of the group, update the patient enlistment configuration of the group
   * `UPDATE_CONFIGURATIONS` | `global` | Update any user its staff configuration
   * @param groupId The id of the targeted group
   * @param userId The id of the targeted user
   * @param requestBody the list of fields to remove
   * @returns AffectedRecords
   */
  removeFields(
    groupId: ObjectId,
    userId: ObjectId,
    requestBody: {
      fields: Array<string>;
    },
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface ConfigurationsStaffService {
  /**
   * Update a staff configuration for a group of a user.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_STAFF_CONFIGURATIONS` | `staff enlistment` | For staff of the group, update the staff enlistment configuration of the group
   * `UPDATE_CONFIGURATIONS` | `staff enlistment` | For staff of the group, update the staff enlistment configuration of the group
   * `UPDATE_CONFIGURATIONS` | `global` | Update any user its staff configuration
   * @param groupId The id of the targeted group
   * @param userId The id of the targeted user
   * @param requestBody UserConfigurationInput
   * @returns AffectedRecords
   */
  update(
    groupId: ObjectId,
    userId: ObjectId,
    requestBody: UserConfigurationInput,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Delete fields from a staff configuration for a group of a user.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_STAFF_CONFIGURATIONS` | `staff enlistment` | For staff of the group, update the staff enlistment configuration of the group
   * `UPDATE_CONFIGURATIONS` | `staff enlistment` | For staff of the group, update the staff enlistment configuration of the group
   * `UPDATE_CONFIGURATIONS` | `global` | Update any user its staff configuration
   * @param groupId The id of the targeted group
   * @param userId The id of the targeted user
   * @param requestBody the list of fields to remove
   * @returns AffectedRecords
   */
  removeFields(
    groupId: ObjectId,
    userId: ObjectId,
    requestBody: {
      fields: Array<string>;
    },
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface ConfigurationsUsersService {
  /**
   * Get a user configuration
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | View your own configuration
   * `VIEW_PATIENT_CONFIGURATIONS` | `staff enlistment` | For patients of the group, view the patient enlistment configuration of the group
   * `VIEW_STAFF_CONFIGURATIONS` | `staff enlistment` | For staff of the group, view the staff enlistment configuration of the group
   * `VIEW_CONFIGURATIONS` | `staff enlistment` | view the patient enlistment configuration of the group
   * `VIEW_CONFIGURATIONS` | `global` | View any user its full configuration
   * @param userId The id of the targeted user
   * @returns UserConfiguration
   */
  get(userId: ObjectId, options?: OptionsBase): Promise<UserConfiguration>;
  /**
   * Update a user configuration
   *
   * Only the `data` content
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_CONFIGURATIONS` | `global` | Update any user configuration
   * none | | Update your own configuration
   * @param userId The id of the targeted user
   * @param requestBody UserConfigurationInput
   * @param rql Add filters to the requested list.
   * @returns AffectedRecords
   */
  update(
    userId: ObjectId,
    requestBody: UserConfigurationInput,
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
  /**
   * Delete fields from a user configuration
   *
   * Only from the `data` field
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_CONFIGURATIONS` | `global` | Update any user configuration
   * none | | Update your own configuration
   * @param userId The id of the targeted user
   * @param requestBody the list of fields to remove
   * @param rql Add filters to the requested list
   * @returns AffectedRecords
   */
  removeFields(
    userId: ObjectId,
    requestBody: {
      fields: Array<string>;
    },
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
}
