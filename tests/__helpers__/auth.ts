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

export const authenticationResponse = {
  applicationId: '58074811b2148f3b28ad75bd',
  userId: '656f1ae851c0f5307421eb96',
  token: '0be953bf1deb6708e18763787d3e4581d9bda062',
  tokenSecret: 'd7f4e6516d87659edeab5c1f0e450a186adc03ed',
  updateTimestamp: '2023-12-05T12:43:20.751Z',
  creationTimestamp: '2023-12-05T12:43:20.751Z',
  id: '656f1ae833190297b20641d0',
  key: '0be953bf1deb6708e18763787d3e4581d9bda062',
  secret: 'd7f4e6516d87659edeab5c1f0e450a186adc03ed',
};
