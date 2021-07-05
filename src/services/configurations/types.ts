import { RQLString } from '../../rql';
import { Entity, Timestamps, ObjectId, AffectedRecords } from '../types';

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
  get(this: ConfigurationsGeneralService): Promise<GeneralConfiguration>;
  update(
    this: ConfigurationsGeneralService,
    requestBody: GeneralConfigurationInput,
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords>;
  removeFields(
    this: ConfigurationsGeneralService,
    requestBody: {
      fields: Array<string>;
    },
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords>;
}

export interface ConfigurationsGroupsService {
  get(
    this: ConfigurationsGroupsService,
    groupId: ObjectId
  ): Promise<GroupConfiguration>;
  update(
    this: ConfigurationsGroupsService,
    groupId: ObjectId,
    requestBody: GroupConfigurationInput,
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords>;
  removeFields(
    this: ConfigurationsGroupsService,
    groupId: ObjectId,
    requestBody: {
      fields: Array<string>;
    },
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords>;
}

export interface ConfigurationsPatientsService {
  update(
    this: ConfigurationsPatientsService,
    groupId: ObjectId,
    userId: ObjectId,
    requestBody: UserConfigurationInput
  ): Promise<AffectedRecords>;
  removeFields(
    this: ConfigurationsPatientsService,
    groupId: ObjectId,
    userId: ObjectId,
    requestBody: {
      fields: Array<string>;
    }
  ): Promise<AffectedRecords>;
}

export interface ConfigurationsStaffService {
  update(
    this: ConfigurationsStaffService,
    groupId: ObjectId,
    userId: ObjectId,
    requestBody: UserConfigurationInput
  ): Promise<AffectedRecords>;
  removeFields(
    this: ConfigurationsStaffService,
    groupId: ObjectId,
    userId: ObjectId,
    requestBody: {
      fields: Array<string>;
    }
  ): Promise<AffectedRecords>;
}

export interface ConfigurationsUsersService {
  get(
    this: ConfigurationsUsersService,
    userId: ObjectId
  ): Promise<UserConfiguration>;
  update(
    this: ConfigurationsUsersService,
    userId: ObjectId,
    requestBody: UserConfigurationInput,
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords>;
  removeFields(
    this: ConfigurationsUsersService,
    userId: ObjectId,
    requestBody: {
      fields: Array<string>;
    },
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords>;
}
