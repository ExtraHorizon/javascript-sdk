import nock from 'nock';
import {AUTH_BASE, DATA_BASE} from '../../../src/constants';
import {createOAuth2Client, OAuth2Client} from '../../../src/index';
import {documentData, lockedDocumentData, newDocumentCreated,} from '../../__helpers__/data';
import {createPagedResponse} from '../../__helpers__/utils';

describe('Documents Service', () => {
  const documentsListResponse = createPagedResponse(documentData);
  const lockedDocumentsListResponse = createPagedResponse(lockedDocumentData);
  const schemaId = '1e9fff9d90135a2a9a718e2f';
  const documentId = documentData.id;

  const host = 'https://api.xxx.extrahorizon.io';
  let sdk: OAuth2Client;

  beforeAll(async () => {
    sdk = createOAuth2Client({
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
    nock.enableNetConnect();
  });

  it('should create a document', async () => {
    nock(`${host}${DATA_BASE}`)
      .post(`/${schemaId}/documents`)
      .reply(200, newDocumentCreated);
    const document = await sdk.data.documents.create(schemaId, {
      additionalProp1: {},
      additionalProp2: {},
      additionalProp3: {},
    });
    expect(document.id).toBe(newDocumentCreated.id);
  });

  it('should create a document with gzip', async () => {
    nock(`${host}${DATA_BASE}`)
      .post(`/${schemaId}/documents`)
      .reply(200, newDocumentCreated);
    const document = await sdk.data.documents.create(
      schemaId,
      {
        additionalProp1: {},
        additionalProp2: {},
        additionalProp3: {},
      },
      { gzip: true }
    );
    expect(document.id).toBe(newDocumentCreated.id);
  });

  it('should request a list of documents', async () => {
    nock(`${host}${DATA_BASE}`)
      .get(`/${schemaId}/documents`)
      .reply(200, documentsListResponse);
    const res = await sdk.data.documents.find(schemaId);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should find a document by id', async () => {
    nock(`${host}${DATA_BASE}`)
      .get(`/${schemaId}/documents?eq(id,${documentId})`)
      .reply(200, documentsListResponse);

    const document = await sdk.data.documents.findById(schemaId, documentId);

    expect(document.id).toBe(documentId);
  });

  it('should find the first document', async () => {
    nock(`${host}${DATA_BASE}`)
      .get(`/${schemaId}/documents`)
      .reply(200, documentsListResponse);

    const document = await sdk.data.documents.findFirst(schemaId);

    expect(document.id).toBe(documentId);
  });

  it('should update a document', async () => {
    nock(`${host}${DATA_BASE}`)
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
    nock(`${host}${DATA_BASE}`)
      .delete(`/${schemaId}/documents/${documentId}`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.documents.remove(schemaId, documentId);
    expect(res.affectedRecords).toBe(1);
  });

  it('should delete fields from a document', async () => {
    nock(`${host}${DATA_BASE}`)
      .post(`/${schemaId}/documents/${documentId}/deleteFields`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.documents.removeFields(schemaId, documentId, {
      fields: ['location.latitude'],
    });
    expect(res.affectedRecords).toBe(1);
  });

  describe('appendObjectToArray', () => {
    it('Appends an object to an array field in a document', async () => {
      const data = {
        avg: 10,
        max: 20,
        min: 5,
      };

      nock(`${host}${DATA_BASE}`)
        .post(`/${schemaId}/documents/${documentId}/hourlySummaries/`, data)
        .reply(200, { ...data, id: '5e9fff9d90135a2a9a718e2f' });

      const response = await sdk.data.documents.appendObjectToArray(
        schemaId,
        documentId,
        'hourlySummaries',
        data
      );

      expect(response).toStrictEqual({
        ...data,
        id: '5e9fff9d90135a2a9a718e2f',
      });
    });

    it('Does not try to normalize the response', async () => {
      const data = { creationTimestamp: 1234567890 };

      nock(`${host}${DATA_BASE}`)
        .post(`/${schemaId}/documents/${documentId}/hourlySummaries/`, data)
        .reply(200, { ...data, id: '5e9fff9d90135a2a9a718e2f' });

      const response = await sdk.data.documents.appendObjectToArray(
        schemaId,
        documentId,
        'hourlySummaries',
        data
      );

      expect(response).toStrictEqual({
        id: '5e9fff9d90135a2a9a718e2f',
        ...data,
      });
    });
  });

  describe('updateObjectInArray', () => {
    it('Updates an object in an array field in a document', async () => {
      const objectId = '5e9fff9d90135a2a9a718e2f';
      const data = {
        avg: 15,
        max: 25,
        min: 10,
      };

      nock(`${host}${DATA_BASE}`)
        .put(`/${schemaId}/documents/${documentId}/hourlySummaries/${objectId}`, data)
        .reply(200, { affectedRecords: 1 });

      const response = await sdk.data.documents.updateObjectInArray(
        schemaId,
        documentId,
        'hourlySummaries',
        objectId,
        data
      );

      expect(response).toStrictEqual({ affectedRecords: 1 });
    });
  });

  describe('removeObjectFromArray', () => {
    it('Removes an object in an array field in a document', async () => {
      const objectId = '5e9fff9d90135a2a9a718e2f';

      nock(`${host}${DATA_BASE}`)
        .delete(`/${schemaId}/documents/${documentId}/hourlySummaries/${objectId}`)
        .reply(200, { affectedRecords: 1 });

      const response = await sdk.data.documents.removeObjectFromArray(
        schemaId,
        documentId,
        'hourlySummaries',
        objectId
      );

      expect(response).toStrictEqual({ affectedRecords: 1 });
    });
  });

  describe('transition', () => {
    it('Transitions a document by id', async () => {
      const body = {
        id: '5e9fff9d90135a2a9a718e2f',
        data: {
          location: {
            x: 1,
            y: 2,
          },
        },
      };

      nock(`${host}${DATA_BASE}`)
        .post(`/${schemaId}/documents/${documentId}/transition`, body)
        .reply(200, { affectedRecords: 1 });

      const res = await sdk.data.documents.transition(schemaId, documentId, body);
      expect(res.affectedRecords).toBe(1);
    });

    it('Transitions a document by name', async () => {
      const body = {
        name: 'move',
        data: {
          location: {
            x: 1,
            y: 2,
          },
        },
      };

      nock(`${host}${DATA_BASE}`)
        .post(`/${schemaId}/documents/${documentId}/transition`, body)
        .reply(200, { affectedRecords: 1 });

      const res = await sdk.data.documents.transition(schemaId, documentId, body);
      expect(res.affectedRecords).toBe(1);
    });
  });

  it('should link groups to a document', async () => {
    nock(`${host}${DATA_BASE}`)
      .post(`/${schemaId}/documents/${documentId}/linkGroups`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.documents.linkGroups(schemaId, documentId, {
      groupIds: ['5e9fff9d90135a2a9a718e2f'],
    });
    expect(res.affectedRecords).toBe(1);
  });

  describe('unlinkGroups', () => {
    it('Unlinks specific groups from a document when supplying group ids', async () => {
      nock(`${host}${DATA_BASE}`)
        .post(`/${schemaId}/documents/${documentId}/unlinkGroups`, {
          groupIds: ['5e9fff9d90135a2a9a718e2f'],
        })
        .reply(200, { affectedRecords: 1 });

      const response = await sdk.data.documents.unlinkGroups(schemaId, documentId, ['5e9fff9d90135a2a9a718e2f']);

      expect(response.affectedRecords).toBe(1);
    });

    it('Unlinks specific groups from a document when supplying a request body w/ group ids', async () => {
      nock(`${host}${DATA_BASE}`)
        .post(`/${schemaId}/documents/${documentId}/unlinkGroups`, {
          groupIds: ['5e9fff9d90135a2a9a718e2f'],
        })
        .reply(200, { affectedRecords: 1 });

      const response = await sdk.data.documents.unlinkGroups(schemaId, documentId, {
        groupIds: ['5e9fff9d90135a2a9a718e2f'],
      });

      expect(response.affectedRecords).toBe(1);
    });

    it('Unlinks all groups from a document when supplying an empty object', async () => {
      nock(`${host}${DATA_BASE}`)
        .post(`/${schemaId}/documents/${documentId}/unlinkGroups`, {})
        .reply(200, { affectedRecords: 1 });

      const response = await sdk.data.documents.unlinkGroups(schemaId, documentId, {});

      expect(response.affectedRecords).toBe(1);
    });
  });

  describe('unlinkAllGroups', () => {
    it('Unlinks all groups from a document', async () => {
      nock(`${host}${DATA_BASE}`)
        .post(`/${schemaId}/documents/${documentId}/unlinkGroups`, {})
        .reply(200, { affectedRecords: 1 });

      const response = await sdk.data.documents.unlinkAllGroups(schemaId, documentId);

      expect(response.affectedRecords).toBe(1);
    });
  });

  it('should link users to a document', async () => {
    nock(`${host}${DATA_BASE}`)
      .post(`/${schemaId}/documents/${documentId}/linkUsers`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.documents.linkUsers(schemaId, documentId, {
      userIds: ['5e9fff9d90135a2a9a718e2f'],
    });
    expect(res.affectedRecords).toBe(1);
  });

  describe('unlinkUsers', () => {
    it('Unlinks specific users from a document when supplying user ids', async () => {
      nock(`${host}${DATA_BASE}`)
        .post(`/${schemaId}/documents/${documentId}/unlinkUsers`, {
          userIds: ['5e9fff9d90135a2a9a718e2f'],
        })
        .reply(200, { affectedRecords: 1 });

      const res = await sdk.data.documents.unlinkUsers(schemaId, documentId, ['5e9fff9d90135a2a9a718e2f']);
      expect(res.affectedRecords).toBe(1);
    });

    it('Unlinks specific users from a document when supplying a body with user ids', async () => {
      nock(`${host}${DATA_BASE}`)
        .post(`/${schemaId}/documents/${documentId}/unlinkUsers`, {
          userIds: ['5e9fff9d90135a2a9a718e2f'],
        })
        .reply(200, { affectedRecords: 1 });

      const res = await sdk.data.documents.unlinkUsers(schemaId, documentId, {
        userIds: ['5e9fff9d90135a2a9a718e2f'],
      });
      expect(res.affectedRecords).toBe(1);
    });

    it('Unlinks all users from a document when an empty object is supplied', async () => {
      nock(`${host}${DATA_BASE}`)
        .post(`/${schemaId}/documents/${documentId}/unlinkUsers`, {})
        .reply(200, { affectedRecords: 1 });

      const res = await sdk.data.documents.unlinkUsers(schemaId, documentId, {});
      expect(res.affectedRecords).toBe(1);
    });
  });

  describe('unlinkAllUsers', () => {
    it('Unlinks all users from a document', async () => {
      nock(`${host}${DATA_BASE}`)
        .post(`/${schemaId}/documents/${documentId}/unlinkUsers`, {})
        .reply(200, { affectedRecords: 1 });

      const res = await sdk.data.documents.unlinkAllUsers(schemaId, documentId);
      expect(res.affectedRecords).toBe(1);
    });
  });

  it('should return true if the document is not in a locked state', async () => {
    nock(`${host}${DATA_BASE}`)
      .get(`/${schemaId}/documents?eq(id,${documentId})`)
      .reply(200, lockedDocumentsListResponse);

    nock(`${host}${DATA_BASE}`)
      .get(`/${schemaId}/documents?eq(id,${documentId})`)
      .reply(200, documentsListResponse);

    const res = await sdk.data.documents.assertNonLockedState(
      schemaId,
      documentId,
      2,
      10
    );
    expect(res).toBe(true);
  });

  it('should throw if the document is in a locked state', async () => {
    nock(`${host}${DATA_BASE}`)
      .get(`/${schemaId}/documents?eq(id,${documentId})`)
      .reply(200, lockedDocumentsListResponse);

    nock(`${host}${DATA_BASE}`)
      .get(`/${schemaId}/documents?eq(id,${documentId})`)
      .reply(200, lockedDocumentsListResponse);

    await expect(
      sdk.data.documents.assertNonLockedState(schemaId, documentId, 2, 10)
    ).rejects.toThrow(new Error('Document is in a locked state'));
  });
});
