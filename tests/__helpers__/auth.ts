import { ApplicationType } from '../../src/services/auth/applications/types';

export const applicationDataList = {
  data: [
    {
      name: 'fitbit',
    },
  ],
};

export const newApplication = {
  id: '507f191e810c19729de860ea',
  type: ApplicationType.oauth2,
  description: 'Test App',
  name: 'Test',
  updateTimestamp: new Date('2019-04-15T11:23:19.670Z'),
  creationTimestamp: new Date('2019-04-15T11:23:19.670Z'),
};

export const newApplicationVersion = {
  id: '507f191e810c19729de860ea',
  name: 'Version 1',
  clientId: '0f4061a353c848eb0e02b80a2fe7bbc2254f1f77',
  clientSecret: '1f4221a223c848eb0e02b80a2fe7bbc2254f1f33',
  creationTimestamp: new Date('2019-04-15T11:23:19.670Z'),
};

export const authorizationData = {
  id: '507f191e810c19729de860ea',
  userId: '507f191e810c19729de860ea',
  clientId: '507f191e810c19729de860ea',
  authorizationCode: 'string',
  state: 'string',
  updateTimestamp: new Date('2021-04-06T11:08:29.616Z'),
  creationTimestamp: new Date('2021-04-06T11:08:29.616Z'),
};

export const mfaSetting = {
  id: '60701bf059080100071a3d90',
  methods: [
    {
      id: '609b8ad0c0de01f7b1e8b54d',
      type: 'totp',
      verified: true,
      updateTimestamp: '2021-05-12T08:01:47.130Z',
      creationTimestamp: '2021-05-12T07:59:12.021Z',
    },
  ],
  enabled: true,
  updateTimestamp: '2021-05-25T11:28:20.514Z',
  lastFailedAttemptTimestamp: '2021-05-25T11:28:20.514Z',
  failedAttempts: 2,
};
