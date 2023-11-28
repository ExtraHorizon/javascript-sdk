import { randomHexString } from './utils';

export const generalConfig = {
  data: {
    epicFeatureEnabled: true,
  },
  userConfiguration: {
    epicFeatureEnabled: true,
  },
  groupConfiguration: {
    epicFeatureEnabled: true,
  },
  staffConfiguration: {
    epicFeatureEnabled: true,
  },
  patientConfiguration: {
    epicFeatureEnabled: true,
  },
};

export const customConfig = {
  data: {
    epic_feature_enabled: true,
  },
  userConfiguration: {
    epic_feature_enabled: true,
  },
  groupConfiguration: {
    epic_feature_enabled: true,
  },
  staffConfiguration: {
    epic_feature_enabled: true,
  },
  patientConfiguration: {
    epic_feature_enabled: true,
  },
};

export const customConfigResponse = {
  ...customConfig,
  id: randomHexString(24),
  updateTimestamp: '2018-04-24T11:57:44.525Z',
  creationTimestamp: '2018-04-24T11:57:44.525Z',
};

export const generalConfigResponse = {
  ...generalConfig,
  id: 'abcdef123456789abcdef123',
  updateTimestamp: '2018-04-24T11:57:44.525Z',
  creationTimestamp: '2018-04-24T11:57:44.525Z',
};

export const groupConfig = {
  data: {
    epicFeatureEnabled: true,
  },
  staffConfiguration: {
    epicFeatureEnabled: true,
  },
  patientConfiguration: {
    epicFeatureEnabled: true,
  },
};

export const customGroupConfig = {
  data: {
    epic_feature_enabled: true,
  },
  staffConfiguration: {
    epic_feature_enabled: true,
  },
  patientConfiguration: {
    epic_feature_enabled: true,
  },
};

export const customGroupConfigResponse = {
  ...customGroupConfig,
  id: randomHexString(24),
  updateTimestamp: '2018-04-24T11:57:44.525Z',
  creationTimestamp: '2018-04-24T11:57:44.525Z',
};

export const groupConfigResponse = {
  ...groupConfig,
  id: 'abcdef123456789abcdef123',
  updateTimestamp: '2018-04-24T11:57:44.525Z',
  creationTimestamp: '2018-04-24T11:57:44.525Z',
};

export const groupConfigInput = {
  data: {
    epicFeatureEnabled: true,
  },
  staffConfiguration: {
    epicFeatureEnabled: true,
  },
  patientConfiguration: {
    epicFeatureEnabled: true,
  },
};

export const customUserConfig = {
  data: {
    epic_feature_enabled: true,
  },
  staffConfiguration: {
    epic_feature_enabled: true,
  },
  patientConfiguration: {
    epic_feature_enabled: true,
  },
};

export const customUserConfigResponse = {
  ...customUserConfig,
  id: randomHexString(24),
  updateTimestamp: '2018-04-24T11:57:44.525Z',
  creationTimestamp: '2018-04-24T11:57:44.525Z',
};

export const userEnlistmentsConfig = {
  staffConfigurations: [
    {
      groupId: 'abcdef123456789abcdef123',
      data: {
        epicFeatureEnabled: true,
      },
    },
  ],
  patientConfigurations: [
    {
      groupId: 'abcdef123456789abcdef123',
      data: {
        epicFeatureEnabled: true,
      },
    },
  ],
};

export const userConfigInput = {
  data: {
    epicFeatureEnabled: true,
  },
};

export const userConfigResponse = {
  ...userEnlistmentsConfig,
  ...userConfigInput,
  id: 'abcdef123456789abcdef123',
  updateTimestamp: '2018-04-24T11:57:44.525Z',
  creationTimestamp: '2018-04-24T11:57:44.525Z',
};
