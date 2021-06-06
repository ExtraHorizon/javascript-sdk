import nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import { Client, client, ParamsOauth2 } from '../../../src/index';
import {
  newDocumentCreated,
  documentData,
  documentsListResponse,
} from '../../__helpers__/data';

describe('Documents Service', () => {
  const schemaId = '1e9fff9d90135a2a9a718e2f';
  const documentId = documentData.id;

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

  it('should create a document', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/documents`)
      .reply(200, newDocumentCreated);
    const document = await sdk.data.documents.create(schemaId, {
      additionalProp1: {},
      additionalProp2: {},
      additionalProp3: {},
    });
    expect(document.id).toBe(newDocumentCreated.id);
  });

  it('should request a list of documents', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .get(`/${schemaId}/documents`)
      .reply(200, documentsListResponse);
    const res = await sdk.data.documents.find(schemaId);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should find a document by id', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .get(`/${schemaId}/documents?eq(id,${documentId})`)
      .reply(200, documentsListResponse);

    const document = await sdk.data.documents.findById(documentId, schemaId);

    expect(document.id).toBe(documentId);
  });

  it('should find the first document', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .get(`/${schemaId}/documents`)
      .reply(200, documentsListResponse);

    const document = await sdk.data.documents.findFirst(schemaId);

    expect(document.id).toBe(documentId);
  });

  it('should update a document', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .put(`/${schemaId}/documents/${documentId}`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.documents.update(schemaId, documentId, {
      additionalProp1: {},
      additionalProp2: {},
      additionalProp3: {},
    });
    expect(res.affectedRecords).toBe(1);
  });

  it('should delete a document', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .delete(`/${schemaId}/documents/${documentId}`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.documents.delete(schemaId, documentId);
    expect(res.affectedRecords).toBe(1);
  });

  it('should delete fields from a document', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/documents/${documentId}/deleteFields`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.documents.deleteFields(schemaId, documentId, {
      fields: ['location.latitude'],
    });
    expect(res.affectedRecords).toBe(1);
  });

  it('should transition a document', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/documents/${documentId}/transition`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.documents.transition(schemaId, documentId, {
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

  it('should link groups to a document', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/documents/${documentId}/linkGroups`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.documents.linkGroups(schemaId, documentId, {
      groupIds: ['5e9fff9d90135a2a9a718e2f'],
    });
    expect(res.affectedRecords).toBe(1);
  });

  it('should unlink groups from a document', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/documents/${documentId}/unlinkGroups`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.documents.unlinkGroups(schemaId, documentId, {
      groupIds: ['5e9fff9d90135a2a9a718e2f'],
    });
    expect(res.affectedRecords).toBe(1);
  });

  it('should link users to a document', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/documents/${documentId}/linkUsers`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.documents.linkUsers(schemaId, documentId, {
      userIds: ['5e9fff9d90135a2a9a718e2f'],
    });
    expect(res.affectedRecords).toBe(1);
  });

  it('should unlink users from a document', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/documents/${documentId}/unlinkUsers`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.documents.unlinkUsers(schemaId, documentId, {
      userIds: ['5e9fff9d90135a2a9a718e2f'],
    });
    expect(res.affectedRecords).toBe(1);
  });
});
