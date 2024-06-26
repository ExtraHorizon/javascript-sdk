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
  country: 'BE',
  birthday: '1970-01-01',
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

export const groupData: Group = {
  groupId: '58074804b2148f3b28ad759a',
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

export const medicationData: Medication = {
  name: 'Xarelto',
  dosis: {
    number: 0,
    unit: MedicationUnit.MG,
  },
  medicationFrequency: MedicationFrequency.AS_NEEDED,
  count: 1,
};
