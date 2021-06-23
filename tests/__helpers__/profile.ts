import {
  Profile,
  ProfileActivity,
  Comorbidities,
  Impediments,
  MedicationUnit,
  MedicationFrequency,
  Group,
  GroupCreation,
  LogEntry,
  Medication,
} from '../../src/services/profiles/types';

export const profileData: Profile = {
  id: '58074804b2148f3b28ad759a',
  addressLine1: 'string',
  addressLine2: 'string',
  city: 'string',
  postalCode: 'string',
  gender: 1,
  length: 0,
  weight: 0,
  afHistory: true,
  comorbidities: [Comorbidities.HEART_FAILURE],
  physician: 'string',
  smoker: true,
  activity: ProfileActivity.NOT_ACTIVE,
  impediments: [Impediments.TREMOR],
  medication: [
    {
      name: 'Xarelto',
      dosis: {
        number: 0,
        unit: MedicationUnit.MG,
      },
      medicationFrequency: MedicationFrequency.AS_NEEDED,
      count: 1,
    },
  ],
  groups: [
    {
      groupId: '58074804b2148f3b28ad759a',
      reason: 'string',
      patientId: 'string',
      customFields: {
        additionalProp1: 'string',
        additionalProp2: 'string',
        additionalProp3: 'string',
      },
    },
  ],
  customFields: {
    additionalProp1: 'string',
    additionalProp2: 'string',
    additionalProp3: 'string',
  },
  creationTimestamp: new Date(),
  updateTimestamp: new Date(),
};

export const profilesResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [profileData],
};

export const comorbiditiesResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [Comorbidities.HEART_FAILURE],
};

export const impedimentsResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [Impediments.TREMOR],
};

export const groupData: Group = {
  reason: 'string',
  patientId: 'string',
  customFields: {
    additionalProp1: 'string',
    additionalProp2: 'string',
    additionalProp3: 'string',
  },
};

export const groupInput: GroupCreation = {
  ...groupData,
  groupId: '58074804b2148f3b28ad759a',
};

export const logData: LogEntry = {
  id: '58074804b2148f3b28ad759a',
  profileId: '58074804b2148f3b28ad759a',
  groupId: '58074804b2148f3b28ad759a',
  userId: '58074804b2148f3b28ad759a',
  text: 'string',
  creationTimestamp: new Date(),
  updateTimestamp: new Date(),
};

export const logsResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [logData],
};

export const medicationData: Medication = {
  name: 'Xarelto',
  dosis: {
    number: 0,
    unit: MedicationUnit.MG,
  },
  medicationFrequency: MedicationFrequency.AS_NEEDED,
  count: 1,
};

export const medicationsResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [medicationData],
};
