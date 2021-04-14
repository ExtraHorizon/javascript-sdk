// eslint-disable-next-line import/no-extraneous-dependencies
import * as nock from 'nock';
import { AUTH_BASE } from '../../../src/constants';
import { Client, client } from '../../../src/index';
import {
  applicationDataList,
  newApplication,
  newApplicationVersion,
} from '../../__helpers__/auth';

describe('Auth - Applications', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';

  let sdk: Client;

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
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('Can create applications', async () => {
    const mockToken = 'mockToken';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });

    nock(`${apiHost}${AUTH_BASE}`)
      .post('/applications')
      .reply(200, newApplication);

    const createdResult = await sdk.auth.createApplication({
      type: newApplication.type,
      name: newApplication.name,
      description: newApplication.description,
    });

    expect(createdResult.id).toEqual(newApplication.id);
  });

  it('Can get applications', async () => {
    const mockToken = 'mockToken';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });

    nock(`${apiHost}${AUTH_BASE}`)
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
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });

    nock(`${apiHost}${AUTH_BASE}`)
      .put(`/applications/${applicationId}`)
      .reply(200, newApplication);

    const updatedResult = await sdk.auth.updateApplication(applicationId, {
      type: newApplication.type,
      name: newApplication.name,
      description: newApplication.description,
    });

    expect(updatedResult.id).toEqual(newApplication.id);
  });

  it('Can delete applications versions', async () => {
    const mockToken = 'mockToken';
    const applicationId = '123';
    const versionId = '456';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });

    nock(`${apiHost}${AUTH_BASE}`)
      .delete(`/applications/${applicationId}/${versionId}`)
      .reply(200, {
        affectedRecords: 1,
      });

    const deleteResult = await sdk.auth.deleteApplicationVersion(
      applicationId,
      versionId
    );

    expect(deleteResult.affectedRecords).toEqual(1);
  });

  it('Can create application versions', async () => {
    const mockToken = 'mockToken';
    const applicationId = '123';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });

    nock(`${apiHost}${AUTH_BASE}`)
      .post(`/applications/${applicationId}/versions`)
      .reply(200, newApplicationVersion);

    const createdResult = await sdk.auth.createApplicationVersion(
      applicationId,
      {
        name: newApplicationVersion.name,
      }
    );

    expect(createdResult.id).toEqual(newApplicationVersion.id);
  });
});
