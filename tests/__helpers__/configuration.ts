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
