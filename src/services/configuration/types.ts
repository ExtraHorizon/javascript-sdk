import { Entity, Timestamps, ObjectId } from '../types';

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
