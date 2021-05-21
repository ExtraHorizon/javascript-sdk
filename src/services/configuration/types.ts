import { Entity, Timestamps } from '../types';

export type Configuration = Record<string, any>;

export interface GeneralConfigurationInput {
  data?: Configuration;
  userConfiguration?: Configuration;
  groupConfiguration?: Configuration;
  staffConfiguration?: Configuration;
  patientConfiguration?: Configuration;
}

export interface GroupConfigurationInput {
  data?: Configuration;
  staffConfiguration?: Configuration;
  patientConfiguration?: Configuration;
}

export type GeneralConfiguration = GeneralConfigurationInput &
  Entity &
  Timestamps;

export type GroupConfiguration = GroupConfigurationInput & Entity & Timestamps;

export interface UserConfiguration {
  data?: Configuration;
}
