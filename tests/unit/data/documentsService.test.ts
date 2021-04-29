import nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import { Client, client } from '../../../src/index';
import {
  newDocumentCreated,
  documentsListResponse,
} from '../../__helpers__/data';

describe('Documents Service', () => {
  const schemaId = '1e9fff9d90135a2a9a718e2f';

  const apiHost = 'https://api.xxx.fibricheck.com';
  let sdk: Client;

  beforeAll(async () => {
    sdk = client({
      apiHost,
    });

    const mockToken = 'mockToken';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });

    await sdk.auth.authenticate({
      clientId: '',
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
});
