import nock from 'nock';
import { AUTH_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2, rqlBuilder } from '../../../src/index';
import {
  applicationData,
  newApplication,
  newApplicationVersion,
} from '../../__helpers__/auth';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Auth - Applications', () => {
  const host = 'https://api.xxx.extrahorizon.io';

  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = createClient({
      host,
      clientId: '',
    });

    const mockToken = 'mockToken';
    nock(host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    await sdk.auth.authenticate({
      username: '',
      password: '',
    });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should create an application', async () => {
    nock(`${host}${AUTH_BASE}`)
      .post('/applications')
      .reply(200, newApplication);

    const createdResult = await sdk.auth.applications.create({
      type: newApplication.type,
      name: newApplication.name,
      description: newApplication.description,
      redirectUris: [],
    });

    expect(createdResult.id).toEqual(newApplication.id);
  });

  describe('find', () => {
    it('Returns a list response of applications', async () => {
      const rql = rqlBuilder().eq('name', applicationData.name).build();

      nock(`${host}${AUTH_BASE}`)
        .get(`/applications${rql}`)
        .reply(200, createPagedResponse(applicationData));

      const result = await sdk.auth.applications.find({ rql });

      expect(result.data[0]).toMatchObject(applicationData);
    });
  });

  describe('findFirst', () => {
    it('Returns the first application found', async () => {
      const rql = rqlBuilder().eq('name', applicationData.name).build();

      nock(`${host}${AUTH_BASE}`)
        .get(`/applications${rql}`)
        .reply(200, createPagedResponse(applicationData));

      const application = await sdk.auth.applications.findFirst({ rql });

      expect(application.name).toBe(applicationData.name);
    });
  });

  describe('findById', () => {
    it('Finds a application by its id', async () => {
      const rql = rqlBuilder().eq('id', applicationData.id).build();

      nock(`${host}${AUTH_BASE}`)
        .get(`/applications${rql}`)
        .reply(200, createPagedResponse(applicationData));

      const application = await sdk.auth.applications.findById(applicationData.id);

      expect(application.id).toBe(applicationData.id);
    });
  });

  describe('findByName', () => {
    it('Finds the first application by its name', async () => {
      const rql = rqlBuilder().eq('name', applicationData.name).build();

      nock(`${host}${AUTH_BASE}`)
        .get(`/applications${rql}`)
        .reply(200, createPagedResponse(applicationData));

      const application = await sdk.auth.applications.findByName(applicationData.name);

      expect(application.name).toBe(applicationData.name);
    });
  });

  it('should get applications', async () => {
    nock(`${host}${AUTH_BASE}`)
      .get('/applications')
      .reply(200, createPagedResponse(applicationData));

    const applications = await sdk.auth.applications.get();

    expect(applications.data).toBeDefined();
    expect(applications.data[0].name).toBe(applicationData.name);
  });

  it('should update an application', async () => {
    const mockToken = 'mockToken';
    const applicationId = '123';
    nock(host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    nock(`${host}${AUTH_BASE}`)
      .put(`/applications/${applicationId}`)
      .reply(200, { affectedRecords: 1 });

    const updatedResult = await sdk.auth.applications.update(applicationId, {
      type: newApplication.type,
      name: newApplication.name,
      description: newApplication.description,
    });

    expect(updatedResult.affectedRecords).toEqual(1);
  });

  it('should delete an application version', async () => {
    const mockToken = 'mockToken';
    const applicationId = '123';
    const versionId = '456';
    nock(host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    nock(`${host}${AUTH_BASE}`)
      .delete(`/applications/${applicationId}/versions/${versionId}`)
      .reply(200, {
        affectedRecords: 1,
      });

    const deleteResult = await sdk.auth.applications.deleteVersion(
      applicationId,
      versionId
    );

    expect(deleteResult.affectedRecords).toEqual(1);
  });

  it('should create an application versions', async () => {
    const mockToken = 'mockToken';
    const applicationId = '123';
    nock(host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    nock(`${host}${AUTH_BASE}`)
      .post(`/applications/${applicationId}/versions`)
      .reply(200, newApplicationVersion);

    const createdResult = await sdk.auth.applications.createVersion(
      applicationId,
      {
        name: newApplicationVersion.name,
      }
    );

    expect(createdResult.id).toEqual(newApplicationVersion.id);
  });
});
