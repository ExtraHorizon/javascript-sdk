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

export const customGeneralConfig = {
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

export const generalConfigResponse = {
  ...generalConfig,
  id: 'abcdef123456789abcdef123',
  updateTimestamp: '2018-04-24T11:57:44.525Z',
  creationTimestamp: '2018-04-24T11:57:44.525Z',
};

export const customGeneralConfigResponse = {
  ...customGeneralConfig,
  id: randomHexString(24),
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

export const groupConfigResponse = {
  ...groupConfig,
  id: 'abcdef123456789abcdef123',
  updateTimestamp: '2018-04-24T11:57:44.525Z',
  creationTimestamp: '2018-04-24T11:57:44.525Z',
};

export const customGroupConfigResponse = {
  ...customGroupConfig,
  id: randomHexString(24),
  updateTimestamp: '2018-04-24T11:57:44.525Z',
  creationTimestamp: '2018-04-24T11:57:44.525Z',
};

export const userConfig = {
  data: {
    epicFeatureEnabled: true,
  },
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

export const customUserConfig = {
  data: {
    epic_feature_enabled: true,
  },
  staffConfigurations: [
    {
      groupId: randomHexString(24),
      data: {
        epic_feature_enabled: true,
      },
    },
  ],
  patientConfigurations: [
    {
      groupId: randomHexString(24),
      data: {
        epic_feature_enabled: true,
      },
    },
  ],
};

export const userConfigResponse = {
  ...userConfig,
  id: 'abcdef123456789abcdef123',
  updateTimestamp: '2018-04-24T11:57:44.525Z',
  creationTimestamp: '2018-04-24T11:57:44.525Z',
};

export const customUserConfigResponse = {
  ...customUserConfig,
  id: randomHexString(24),
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
