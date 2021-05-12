import nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import { Client, client, ParamsOauth2 } from '../../../src/index';
import {
  newDocumentCreated,
  documentsListResponse,
} from '../../__helpers__/data';

describe('Documents Service', () => {
  const schemaId = '1e9fff9d90135a2a9a718e2f';
  const documentId = '2e9fff9d90135a2a9a718e2f';

  const apiHost = 'https://api.xxx.fibricheck.com';
  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = client({
      apiHost,
      clientId: '',
    });

    const mockToken = 'mockToken';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    await sdk.auth.authenticate({
      username: '',
      password: '',
    });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Create a document', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/documents`)
      .reply(200, newDocumentCreated);
    const document = await sdk.data.createDocument(schemaId, {
      additionalProp1: {},
      additionalProp2: {},
      additionalProp3: {},
    });
    expect(document.id).toBe(newDocumentCreated.id);
  });

  it('Request a list of documents', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .get(`/${schemaId}/documents`)
      .reply(200, documentsListResponse);
    const res = await sdk.data.findDocuments(schemaId);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('Update a document', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .put(`/${schemaId}/documents/${documentId}`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.updateDocument(schemaId, documentId, {
      additionalProp1: {},
      additionalProp2: {},
      additionalProp3: {},
    });
    expect(res.affectedRecords).toBe(1);
  });

  it('Delete a document', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .delete(`/${schemaId}/documents/${documentId}`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.deleteDocument(schemaId, documentId);
    expect(res.affectedRecords).toBe(1);
  });

  it('Delete fields from a document', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/documents/${documentId}/deleteFields`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.deleteFieldsFromDocument(schemaId, documentId, {
      fields: ['location.latitude'],
    });
    expect(res.affectedRecords).toBe(1);
  });

  it('Transition a document', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/documents/${documentId}/transition`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.transitionDocument(schemaId, documentId, {
      id: '5e9fff9d90135a2a9a718e2f',
      data: {
        location: {
          x: 1,
          y: 2,
        },
      },
    });
    expect(res.affectedRecords).toBe(1);
  });

  it('Link groups to a document', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/documents/${documentId}/linkGroups`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.linkGroupsToDocument(schemaId, documentId, {
      groupIds: ['5e9fff9d90135a2a9a718e2f'],
    });
    expect(res.affectedRecords).toBe(1);
  });

  it('Unlink groups from a document', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/documents/${documentId}/unlinkGroups`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.unlinkGroupsFromDocument(schemaId, documentId, {
      groupIds: ['5e9fff9d90135a2a9a718e2f'],
    });
    expect(res.affectedRecords).toBe(1);
  });

  it('Link users to a document', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/documents/${documentId}/linkUsers`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.linkUsersToDocument(schemaId, documentId, {
      userIds: ['5e9fff9d90135a2a9a718e2f'],
    });
    expect(res.affectedRecords).toBe(1);
  });

  it('Unlink users from a document', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/documents/${documentId}/unlinkUsers`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.unlinkUsersFromDocument(schemaId, documentId, {
      userIds: ['5e9fff9d90135a2a9a718e2f'],
    });
    expect(res.affectedRecords).toBe(1);
  });
});
