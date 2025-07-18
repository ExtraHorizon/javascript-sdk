import nock from 'nock';
import {AUTH_BASE, DATA_BASE} from '../../../src/constants';
import {createOAuth2Client, OAuth2Client} from '../../../src/index';
import {newIndexCreated, newIndexInput, newSchemaCreated,} from '../../__helpers__/data';

describe('Indexes Service', () => {
  const schemaId = newSchemaCreated.id;
  const indexId = newIndexCreated.id;
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

  it('should create an index', async () => {
    nock(`${host}${DATA_BASE}`)
      .post(`/${schemaId}/indexes`)
      .reply(200, newIndexCreated);
    const index = await sdk.data.indexes.create(schemaId, newIndexInput);
    expect(index.id).toBe(newIndexCreated.id);
  });

  it('should delete an index', async () => {
    nock(`${host}${DATA_BASE}`)
      .delete(`/${schemaId}/indexes/${indexId}`)
      .reply(200, {
        affectedRecords: 1,
      });
    const res = await sdk.data.indexes.remove(indexId, schemaId);
    expect(res.affectedRecords).toBe(1);
  });
});
