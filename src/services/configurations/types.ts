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
  get(options: OptionsBase): Promise<GeneralConfiguration>;
  update(
    requestBody: GeneralConfigurationInput,
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
  removeFields(
    requestBody: {
      fields: Array<string>;
    },
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
}

export interface ConfigurationsGroupsService {
  get(groupId: ObjectId, options: OptionsBase): Promise<GroupConfiguration>;
  update(
    groupId: ObjectId,
    requestBody: GroupConfigurationInput,
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
  removeFields(
    groupId: ObjectId,
    requestBody: {
      fields: Array<string>;
    },
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
}

export interface ConfigurationsPatientsService {
  update(
    groupId: ObjectId,
    userId: ObjectId,
    requestBody: UserConfigurationInput,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  removeFields(
    this: ConfigurationsPatientsService,
    groupId: ObjectId,
    userId: ObjectId,
    requestBody: {
      fields: Array<string>;
    },
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface ConfigurationsStaffService {
  update(
    groupId: ObjectId,
    userId: ObjectId,
    requestBody: UserConfigurationInput,
    options: OptionsBase
  ): Promise<AffectedRecords>;
  removeFields(
    groupId: ObjectId,
    userId: ObjectId,
    requestBody: {
      fields: Array<string>;
    },
    options: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface ConfigurationsUsersService {
  get(userId: ObjectId, options: OptionsBase): Promise<UserConfiguration>;
  update(
    userId: ObjectId,
    requestBody: UserConfigurationInput,
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
  removeFields(
    userId: ObjectId,
    requestBody: {
      fields: Array<string>;
    },
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
}
