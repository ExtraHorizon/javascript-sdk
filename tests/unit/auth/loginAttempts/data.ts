import { randomUUID } from 'crypto';
import { randomHexString } from '../../../__helpers__/utils';

export const data = [
  {
    id: '63fddd01a2217140d0defa9a',
    providerId: randomUUID(),
    providerSubjectId: randomHexString(),
    userId: '63f74665245ea576278df088',
    status: 'success',
    updateTimestamp: '2023-02-28T10:52:49.939Z',
    creationTimestamp: '2023-02-28T10:52:49.939Z',
  },
  {
    id: '63fddd0ea22171557fdefa9e',
    providerId: randomUUID(),
    providerSubjectId: randomHexString(),
    userId: '63f74665245ea576278df088',
    status: 'success',
    updateTimestamp: '2023-02-28T10:53:02.062Z',
    creationTimestamp: '2023-02-28T10:53:02.062Z',
  },
  {
    id: '63fdde78a221716b7fdefaaf',
    providerId: randomUUID(),
    providerSubjectId: randomHexString(),
    status: 'failed',
    error: {
      message: 'This email address is already in use',
      code: 203,
      name: 'EMAIL_USED_EXCEPTION',
    },
    updateTimestamp: '2023-02-28T10:59:04.908Z',
    creationTimestamp: '2023-02-28T10:59:04.908Z',
  },
  {
    id: '63fdde7da2217133badefab0',
    providerId: randomUUID(),
    providerSubjectId: randomHexString(),
    status: 'failed',
    error: {
      message: 'This email address is already in use',
      code: 203,
      name: 'EMAIL_USED_EXCEPTION',
    },
    updateTimestamp: '2023-02-28T10:59:09.853Z',
    creationTimestamp: '2023-02-28T10:59:09.853Z',
  },
  {
    id: '63fe01b8a22171bac4defbd5',
    providerId: randomUUID(),
    providerSubjectId: randomHexString(),
    userId: '63f74665245ea576278df088',
    status: 'success',
    updateTimestamp: '2023-02-28T13:29:28.719Z',
    creationTimestamp: '2023-02-28T13:29:28.719Z',
  },
  {
    id: '63fe01bea221717104defbd6',
    providerId: randomUUID(),
    providerSubjectId: randomHexString(),
    status: 'failed',
    error: {
      message: 'This email address is already in use',
      code: 203,
      name: 'EMAIL_USED_EXCEPTION',
    },
    updateTimestamp: '2023-02-28T13:29:34.977Z',
    creationTimestamp: '2023-02-28T13:29:34.977Z',
  },
  {
    id: '63fe27eba22171002bdefcee',
    providerId: randomUUID(),
    status: 'failed',
    error: {
      message: 'The token endpoint of the provider gave an unexpected result',
      code: 138,
      name: 'OIDC_PROVIDER_RESPONSE_EXCEPTION',
    },
    updateTimestamp: '2023-02-28T16:12:27.151Z',
    creationTimestamp: '2023-02-28T16:12:27.151Z',
  },
  {
    id: '6400c43ca22171a61fdf13ca',
    providerId: randomUUID(),
    status: 'failed',
    error: {
      message: 'The token endpoint of the provider gave an unexpected result',
      code: 138,
      name: 'OIDC_PROVIDER_RESPONSE_EXCEPTION',
    },
    updateTimestamp: '2023-03-02T15:43:56.973Z',
    creationTimestamp: '2023-03-02T15:43:56.973Z',
  },
  {
    id: '6400df584b50030007678683',
    providerId: randomUUID(),
    status: 'failed',
    error: {
      message: 'The token endpoint of the provider gave an unexpected result',
      code: 138,
      name: 'OIDC_PROVIDER_RESPONSE_EXCEPTION',
    },
    updateTimestamp: '2023-03-02T17:39:36.520Z',
    creationTimestamp: '2023-03-02T17:39:36.520Z',
  },
  {
    id: '6405b6cf444bc7529c1cf995',
    providerId: randomUUID(),
    providerSubjectId: randomHexString(),
    userId: '63fcb7e2245ea576278df097',
    status: 'success',
    updateTimestamp: '2023-03-06T09:47:59.112Z',
    creationTimestamp: '2023-03-06T09:47:59.112Z',
  },
  {
    id: '6405b6fe444bc7763a1cf99a',
    providerId: randomUUID(),
    status: 'failed',
    error: {
      message:
        'The authorization code was not accepted by the provider: Bad Request',
      code: 139,
      name: 'OIDC_INVALID_AUTHORIZATION_CODE_EXCEPTION',
    },
    updateTimestamp: '2023-03-06T09:48:46.081Z',
    creationTimestamp: '2023-03-06T09:48:46.081Z',
  },
  {
    id: '6405b77f444bc7fe901cf99e',
    providerId: randomUUID(),
    status: 'failed',
    error: {
      message:
        'The authorization code was not accepted by the provider: Bad Request',
      code: 139,
      name: 'OIDC_INVALID_AUTHORIZATION_CODE_EXCEPTION',
    },
    updateTimestamp: '2023-03-06T09:50:55.660Z',
    creationTimestamp: '2023-03-06T09:50:55.660Z',
  },
  {
    id: '6405b786444bc7f3311cf99f',
    providerId: randomUUID(),
    status: 'failed',
    error: {
      message:
        'The authorization code was not accepted by the provider: Malformed auth code.',
      code: 139,
      name: 'OIDC_INVALID_AUTHORIZATION_CODE_EXCEPTION',
    },
    updateTimestamp: '2023-03-06T09:51:02.761Z',
    creationTimestamp: '2023-03-06T09:51:02.761Z',
  },
  {
    id: '6405b907444bc7977b1cf9b8',
    providerId: randomUUID(),
    providerSubjectId: randomHexString(),
    userId: '6405b9076b4dac06b55520ee',
    status: 'success',
    updateTimestamp: '2023-03-06T09:57:27.707Z',
    creationTimestamp: '2023-03-06T09:57:27.707Z',
  },
  {
    id: '6405b9e3444bc789721cf9c6',
    providerId: randomUUID(),
    status: 'failed',
    error: {
      message:
        'The authorization code was not accepted by the provider: Malformed auth code.',
      code: 139,
      name: 'OIDC_INVALID_AUTHORIZATION_CODE_EXCEPTION',
    },
    updateTimestamp: '2023-03-06T10:01:07.117Z',
    creationTimestamp: '2023-03-06T10:01:07.117Z',
  },
  {
    id: '6405b9fa444bc73f861cf9c9',
    providerId: randomUUID(),
    providerSubjectId: randomHexString(),
    userId: '6405b9076b4dac06b55520ee',
    status: 'success',
    updateTimestamp: '2023-03-06T10:01:30.342Z',
    creationTimestamp: '2023-03-06T10:01:30.342Z',
  },
  {
    id: '640719d0444bc7bcec1d05e1',
    status: 'failed',
    error: {
      message: 'Requested resource is unknown',
      code: 16,
      name: 'RESOURCE_UNKNOWN_EXCEPTION',
    },
    updateTimestamp: '2023-03-07T11:02:40.708Z',
    creationTimestamp: '2023-03-07T11:02:40.708Z',
  },
  {
    id: '640719d6444bc7359c1d05e2',
    providerId: randomUUID(),
    providerSubjectId: randomHexString(),
    status: 'failed',
    error: {
      message: 'This email address is already in use',
      code: 203,
      name: 'EMAIL_USED_EXCEPTION',
    },
    updateTimestamp: '2023-03-07T11:02:46.136Z',
    creationTimestamp: '2023-03-07T11:02:46.136Z',
  },
  {
    id: '640886d7db8bd00bd6f15624',
    providerId: randomUUID(),
    providerSubjectId: randomHexString(),
    status: 'failed',
    error: {
      message: 'This email address is already in use',
      code: 203,
      name: 'EMAIL_USED_EXCEPTION',
    },
    updateTimestamp: '2023-03-08T13:00:07.646Z',
    creationTimestamp: '2023-03-08T13:00:07.646Z',
  },
  {
    id: '6408876cdb8bd07495f1562b',
    providerId: randomUUID(),
    providerSubjectId: randomHexString(),
    userId: '63f74665245ea576278df088',
    status: 'success',
    updateTimestamp: '2023-03-08T13:02:36.633Z',
    creationTimestamp: '2023-03-08T13:02:36.633Z',
  },
];
