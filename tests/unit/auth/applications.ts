// eslint-disable-next-line import/no-extraneous-dependencies
import * as nock from 'nock';
import { client } from '../../../src/index';
import {
  applicationDataList,
  newApplication,
  newApplicationVersion,
} from '../../__helpers__/auth';

describe('Users', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';
  const authBase = '/auth/v2';
  let sdk: ReturnType<typeof client>;

  beforeAll(() => {
    sdk = client({
      apiHost,
      oauth: {
        clientId: '',
        username: '',
        password: '',
      },
    });

    const mockToken = 'mockToken';
    nock(apiHost)
      .post('/auth/v2/oauth2/token')
      .reply(200, { access_token: mockToken });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  // it('Can get health', async () => {
  //   nock(`${apiHost}/users/v1`).get('/health').reply(200, '');

  //   const health = await sdk.users.health();

  //   expect(health).toBe(true);
  // });

  it('Can create applications', async () => {
    const mockToken = 'mockToken';
    nock(apiHost)
      .post('/auth/v2/oauth2/token')
      .reply(200, { access_token: mockToken });

    nock(`${apiHost}${authBase}`)
      .post('/applications')
      .reply(200, newApplication);

    const createdResult = await sdk.auth.createApplication({
      type: newApplication.type,
      name: newApplication.name,
      description: newApplication.description,
    });

    expect(createdResult).toEqual(newApplication);
  });

  it('Can get applications', async () => {
    const mockToken = 'mockToken';
    nock(apiHost)
      .post('/auth/v2/oauth2/token')
      .reply(200, { access_token: mockToken });

    nock(`${apiHost}${authBase}`)
      .get('/applications')
      .reply(200, applicationDataList);

    const applications = await sdk.auth.getApplications();

    expect(applications.data).toBeDefined();
    expect(applications.data[0].name).toEqual(applicationDataList.data[0].name);
  });

  it('Can update applications', async () => {
    const mockToken = 'mockToken';
    const applicationId = '123';
    nock(apiHost)
      .post('/auth/v2/oauth2/token')
      .reply(200, { access_token: mockToken });

    nock(`${apiHost}${authBase}`)
      .put(`/applications/${applicationId}`)
      .reply(200, newApplication);

    const updatedResult = await sdk.auth.updateApplication(applicationId, {
      type: newApplication.type,
      name: newApplication.name,
      description: newApplication.description,
    });

    expect(updatedResult).toEqual(newApplication);
  });

  it('Can delete applications versions', async () => {
    const mockToken = 'mockToken';
    const applicationId = '123';
    const versionId = '456';
    nock(apiHost)
      .post('/auth/v2/oauth2/token')
      .reply(200, { access_token: mockToken });

    nock(`${apiHost}${authBase}`)
      .delete(`/applications/${applicationId}/${versionId}`)
      .reply(200, {
        affectedRecords: 1,
      });

    const deleteResult = await sdk.auth.deleteApplicationVersion(
      applicationId,
      versionId
    );

    expect(deleteResult).toEqual(1);
  });

  it('Can create application versions', async () => {
    const mockToken = 'mockToken';
    const applicationId = '123';
    nock(apiHost)
      .post('/auth/v2/oauth2/token')
      .reply(200, { access_token: mockToken });

    nock(`${apiHost}${authBase}`)
      .post(`/applications/${applicationId}/versions`)
      .reply(200, newApplicationVersion);

    const createdResult = await sdk.auth.createApplicationVersion(
      applicationId,
      {
        name: newApplicationVersion.name,
      }
    );

    expect(createdResult).toEqual(newApplicationVersion);
  });
});
